const BaseModel = require('../db/models/index');
const { Op } = BaseModel.Sequelize;
const Feedback = require('../lib/Feedback');
const {
  createData,
  updateData,
  deleteData,
  dataExists,
  isEmpty,
  validatePensioneer: validatePensioneer,
  validateLogin,
  encryptPassword,
  validateNextOfKin,
} = require('../lib/helpers');
const Pager = require('../lib/Pager');
const Sanitizer = require('../lib/Sanitizer');
const {
  generateErrorFeedback,
  generateAuthErrorFeedback,
  generateFormErrorFeedack,
  generatePermissionErrorFeedback,
} = require('../lib/models/ErrorHandler');
const { createPensioneer, Pensioneer } = require('../lib/models/Pensioneer');
const { GetAuthUser } = require('../lib/AuthManager');
const { Constants } = require('../lib/models/Constants');
const { excelReader } = require('../services/excel-reader');
const { createLogin, Login } = require('../lib/models/Login');
const UserType = require('../lib/models/UserType');
const { createNextOfKin, NextOfKin } = require('../lib/models/NextOfKin');
const { raw } = require('express');
const Model = 'Pensioneer';

exports.getPensioneers = async (req, res, next) => {
  let feedback;
  let page = Number(req.query.page) || 1;
  let paginate = req.query.paginate === 'false' ? false : true;
  let limit = Number(req.query.limit) || 10;
  let {
    searchquery,
    dateofemp,
    dateofret,
    fromdateofret,
    todateofret,
  } = req.query;

  try {
    let filter = {};
    if (searchquery) {
      filter[Op.or] = [
        {
          surname: {
            [Op.like]: `%${searchquery}%`,
          },
        },
        {
          firstname: {
            [Op.like]: `%${searchquery}%`,
          },
        },
        {
          othername: {
            [Op.like]: `%${searchquery}%`,
          },
        },
      ];
    }

    if (dateofemp) {
      filter.dateOfEmp = dateofemp;
    }

    if (dateofret) {
      filter.dateOfRet = dateofret;
    }

    if (fromdateofret && todateofret) {
      filter.dateOfRet = {
        [Op.gte]: fromdateofret,
        [Op.lte]: todateofret,
      };
    }

    let pager = new Pager(Model, limit, page);
    feedback = await pager.getData(
      filter,
      Constants.PensioneerIncludes,
      [['surname', 'ASC']],
      paginate
    );
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }

  res.json(feedback);
};

exports.getPensioneer = async (req, res, next) => {
  let feedback;
  let { authorization } = req.query;
  let authUser = GetAuthUser(authorization);

  console.log('Singlet:', authUser);

  if (authUser && authUser.userType === UserType.Pensioneer) {
    let loginId = authUser.login;
    let pensioneer = await BaseModel.Pensioneer.findOne({
      where: { loginId },
      include: Constants.PensioneerIncludes,
    });

    if (pensioneer) {
      feedback = new Feedback(pensioneer, true, 'success');
    } else {
      feedback = new Feedback({}, false, 'ensure that you are logged in.');
    }
  } else {
    feedback = generateAuthErrorFeedback();
  }
  feedback.isLoggedIn = authUser ? true : false;
  res.json(feedback);
};

exports.savePensioneer = async (req, res, next) => {
  let feedback = new Feedback(null, false, '');
  feedback = req.body;
  // let { formData } = req.body; //TODO: remove after test

  if (feedback.success || true) {
    try {
      // extract form data
      let { formData, uploadURL, fileName } = feedback.result;
      formData = JSON.parse(formData);
      formData.fileName = fileName || uploadURL || 'avatar.png';

      let pensioneerData = createPensioneer(formData);
      let loginData = createLogin(formData.Login, UserType.Pensioneer);
      let nextOfKinData = createNextOfKin(formData.NextOfKin);

      let errors = {};
      validateLogin(errors, loginData);
      validatePensioneer(errors, pensioneerData);
      validateNextOfKin(errors, nextOfKinData);

      if (isEmpty(errors)) {
        // check if email already exists
        let emailExists = await BaseModel.Login.findOne({
          where: { email: loginData.email },
        });
        if (emailExists) {
          return res.json(
            new Feedback(null, false, 'email address already exists')
          );
        }
        //
        // check if salary structure has level and grade
        let structureExists = await dataExists('SalaryStructureList', {
          level: pensioneerData.level,
          grade: pensioneerData.grade,
          structureId: pensioneerData.structureId,
        });
        //--
        if (!structureExists) {
          return res.json(
            new Feedback(
              null,
              false,
              'The selected level and grade does not match any salary in the structure list'
            )
          );
        }
        // check if pensioneer account no already exists
        let pAccountNoExists = await BaseModel.Pensioneer.findOne({
          where: { accountNo: pensioneerData.accountNo },
        });
        //
        if (pAccountNoExists) {
          return res.json(
            new Feedback(
              null,
              false,
              `Pensioneer account no. [${pensioneerData.accountNo}] already exists.`
            )
          );
        }
        // check if next of kin account no already exists
        let nAccountNoExists = await BaseModel.NextOfKin.findOne({
          where: { accountNo: nextOfKinData.accountNo },
        });
        //
        if (nAccountNoExists) {
          return res.json(
            new Feedback(
              null,
              false,
              `Next of kin account no. [${nextOfKinData.accountNo}] already exists.`
            )
          );
        }
        //
        // start SQL Transaction
        let transaction = await BaseModel.sequelize.transaction();
        // encrpt password
        loginData.password = encryptPassword(loginData.password);
        // create login
        feedback = await createData('Login', loginData, [], transaction);
        //
        // Login Created
        if (feedback.success) {
          let loginId = feedback.result.id;
          // assign login id to pensioneer
          pensioneerData.loginId = loginId;
          // create pensioneer
          feedback = await createData(Model, pensioneerData, [], transaction);
          // Pensioneer Created
          if (feedback.success) {
            let pensioneerId = feedback.result.id;
            nextOfKinData.prId = pensioneerId;
            feedback = await createData(
              'NextOfKin',
              nextOfKinData,
              null,
              transaction
            );
            // Next Of Kin Created
            if (feedback.success) {
              await transaction.commit();
              let pensioneer = await BaseModel[Model].findOne({
                where: { id: pensioneerId },
                include: Constants.PensioneerIncludes,
              });
              feedback = new Feedback(pensioneer, true, 'success');
            }
          }
        }
      } else {
        feedback = generateFormErrorFeedack(errors);
      }
    } catch (error) {
      console.log(error);
      feedback = generateErrorFeedback(error);
    }
  }

  res.json(feedback);
};

exports.savePensioneersUpload = async (req, res, next) => {
  let feedback = new Feedback(null, false, '');
  feedback = req.body;
  if (feedback.success) {
    try {
      let { formData, uploadURL, fileName } = feedback.result;
      if (formData) formData = JSON.parse(formData);
      let rawJSON = excelReader(uploadURL);
      let pensioneersData = [];
      let errors = {};

      let index = 0;
      // The target data is in Sheet1
      for (let rawData of rawJSON.Sheet1) {
        // find this salary structure provided as short name
        let salaryStructure = await BaseModel.SalaryStructure.findOne({
          where: { shortName: rawData.SalaryStructure },
        });
        // find this department
        let dept = await BaseModel.Department.findOne({
          where: { name: rawData.Department },
        });
        // find this designation
        let dsg = await BaseModel.Designation.findOne({
          where: { name: rawData.Designation },
        });
        // find pensioneer bank
        let pBank = await BaseModel.Bank.findOne({
          where: { name: rawData.Bank },
        });
        // find pensioneer next of kin bank
        let nBank = await BaseModel.Bank.findOne({
          where: { name: rawData.NOKBank },
        });
        // find this StaffClass
        let staffClass = await BaseModel.StaffClass.findOne({
          where: { name: rawData.Class },
        });

        // error cache hold all errors
        errors[
          `${index}`
        ] = `${rawData.Surname} ${rawData.Firstname} ${rawData.Othername}`;

        // Validate Raw Data  Entries
        if (salaryStructure) {
          // check if salary structure list has this level and grade
          let structureExists = await dataExists('SalaryStructureList', {
            level: rawData.Level,
            grade: rawData.Grade,
            structureId: salaryStructure.id,
          });

          // check if pensioneer account exists
          let pAccountNoExists = await dataExists('Pensioneer', {
            accountNo: rawData.AccountNo,
          });

          if (pAccountNoExists)
            errors[
              `${index}`
            ] += `, account no. [${rawData.AccountNo}] already exists`;

          // check if pensioneer next of kin account exists
          let nAccountNoExists = await dataExists('NextOfKin', {
            accountNo: rawData.AccountNo,
          });
          //
          if (nAccountNoExists)
            errors[
              `${index}`
            ] += `, next of kin account no. [${rawData.AccountNo}] already exists`;
          // Verify if email exists
          let emailExists = await BaseModel.Login.findOne({
            where: { email: rawData.Email },
          });
          if (emailExists)
            errors[`${index}`] += `, email [${rawData.Email}] already exists`;

          if (structureExists) {
            if (!dept)
              errors[
                `${index}`
              ] += `, department [${rawData.Department}] does not exists`;

            if (!dsg)
              errors[
                `${index}`
              ] += `, designation [${rawData.Designation}] does not exists`;

            if (!pBank)
              errors[`${index}`] += `, bank [${rawData.Bank}] does not exists`;

            if (!nBank)
              errors[
                `${index}`
              ] += `, next of kin bank [${rawData.Bank}] does not exists`;

            if (!staffClass)
              errors[
                `${index}`
              ] += `, class [${rawData.Class}] does not exists`;

            if (
              dept &&
              dsg &&
              pBank &&
              nBank &&
              staffClass &&
              !pAccountNoExists &&
              !nAccountNoExists &&
              !emailExists
            ) {
              // Create Login
              let loginData = new Login(
                rawData.Email,
                encryptPassword(rawData.Password),
                UserType.Pensioneer
              );
              // Create Pensioneer
              let pensioneerData = new Pensioneer(
                null,
                dept.id,
                dsg.id,
                staffClass.id,
                salaryStructure.id,
                pBank.id,
                rawData.Level,
                rawData.Grade,
                rawData.Surname,
                rawData.Firstname,
                rawData.Othername,
                rawData.Gender,
                rawData.DateOfEmp,
                rawData.DateOfRet,
                rawData.AccountNo,
                '/assets/avatar.png',
                rawData.Phone,
                rawData.Address
              );
              // Create Next Of Kin
              let nextOfKinData = new NextOfKin(
                null,
                nBank.id,
                rawData.NOKSurname,
                rawData.NOKFirstname,
                rawData.NOKOthername,
                rawData.NOKGender,
                rawData.NOKPhone,
                rawData.NOKAddress,
                rawData.NOKAccountNo,
                rawData.NOKRelationship
              );
              // Start SQL transaction
              let transaction = await BaseModel.sequelize.transaction();
              // create login for this pensioneer
              feedback = await createData('Login', loginData, [], transaction);
              if (feedback.success) {
                let loginId = feedback.result.id;
                // assign login to pensioneer
                pensioneerData.loginId = loginId;
                // create pensioneer
                feedback = await createData(
                  'Pensioneer',
                  pensioneerData,
                  [],
                  transaction
                );
                // pensioneer created
                if (feedback.success) {
                  let pensioneerId = feedback.result.id;
                  // assign pensioneer to next of kin
                  nextOfKinData.prId = pensioneerId;
                  // create next of kin
                  feedback = await createData(
                    'NextOfKin',
                    nextOfKinData,
                    [],
                    transaction
                  );
                  // next of kin created
                  if (feedback.success) {
                    // commit transaction
                    await transaction.commit();
                    delete errors[`${index}`];
                    feedback = new Feedback([], true, 'success');
                  } else {
                    errors[`${index}`] += `, failed to create next of kin`;
                  }
                } else {
                  errors[`${index}`] += `, failed to create pensioneer`;
                }
              } else {
                errors[`${index}`] += `, failed to create login`;
              }
            }
          } else {
            errors[
              `${index}`
            ] += `,level and grade [${rawData.Level}, ${rawData.grade}] does not match any annual salary in the salary structure.`;
          }
        } else {
          errors[
            `${index}`
          ] += ` salary structure [${rawData.SalaryStructure}] does not exists`;
        }
        ++index;
      }

      console.log(Object.values(errors));

      if (!isEmpty(errors)) {
        feedback = new Feedback(
          Object.values(errors),
          false,
          'Operation failed'
        );
      }
    } catch (error) {
      console.log(error);
      feedback = generateErrorFeedback(error);
    }
  }

  res.json(feedback);
};

exports.updatePensioneer = async (req, res, next) => {
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback;
  if (authUser) {
    try {
      let pensioneerData = createPensioneer(formData);
      let loginData = createLogin(formData.Login);
      let nextOfKinData = createNextOfKin(formData.NextOfKin);

      let errors = {};

      validateLogin(errors, loginData, true);
      validatePensioneer(errors, pensioneerData, true);
      validateNextOfKin(errors, nextOfKinData, true);

      if (loginData && loginData.password)
        loginData.password = encryptPassword(loginData.password);

      if (isEmpty(errors)) {
        // ok

        await updateData('Login', loginData, { id: loginData.id });
        await updateData('NextOfKin', nextOfKinData, { id: nextOfKinData.id });
        feedback = await updateData(
          Model,
          pensioneerData,
          {
            id: pensioneerData.id,
          },
          Constants.PensioneerIncludes
        );
      } else {
        feedback = generateFormErrorFeedack(errors);
      }
    } catch (error) {
      console.log(error);
      feedback = generateErrorFeedback(error);
    }
  } else {
    feedback = generatePermissionErrorFeedback();
  }
  res.json(feedback);
};

exports.updateNextOfKin = async (req, res, next) => {
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback;
  if (authUser) {
    try {
      let nextOfKinData = createNextOfKin(formData);
      let errors = {};
      validateNextOfKin(errors, nextOfKinData, true);
      if (isEmpty(errors)) {
        // ok
        feedback = await updateData(
          Model,
          nextOfKinData,
          {
            id: nextOfKinData.id,
          },
          [{ model: BaseModel.Bank }]
        );
      } else {
        feedback = generateFormErrorFeedack(errors);
      }
    } catch (error) {
      console.log(error);
      feedback = generateErrorFeedback(error);
    }
  } else {
    feedback = generatePermissionErrorFeedback();
  }
  res.json(feedback);
};

exports.changePassport = async (req, res, next) => {
  let feedback = new Feedback(null, false, 'failed');
  feedback = req.body;
  if (feedback.success) {
    try {
      let { formData, uploadURL, fileName } = feedback.result;
      formData = JSON.parse(formData);
      formData.fileName = fileName || uploadURL;
      let pensioneerData = createPensioneer(formData);

      feedback = await updateData(
        Model,
        pensioneerData,
        { id: pensioneerData.id },
        Constants.PensioneerIncludes
      );
    } catch (error) {
      console.log(error);
      feedback = generateErrorFeedback(error);
    }
  }
  res.json(feedback);
};

exports.deletePensioneer = async (req, res, next) => {
  let { id, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback;
  try {
    if (authUser) {
      result = await deleteData(Model, {
        field: 'id',
        value: id,
      });

      feedback = new Feedback(result, true, 'deleted successfully.');
      feedback.message = Boolean(feedback.result)
        ? feedback.message
        : 'no data was deleted';
    } else {
      feedback = generateAuthErrorFeedback();
    }
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }
  res.json(feedback);
};

// exports.userDashboard = async (req, res, next) => {
//   let feedback;
//   let { authorization } = req.query;
//   let authUser = GetAuthUser(authorization);
//   try {
//     if (authUser) {
//       let d = new Date();
//       let from = `${d.getFullYear()}-1-1`;
//       let to = `${d.getFullYear()}-2-31`;
//       let totalStaff = await BaseModel.Staff.count();
//       let totalDepts = await BaseModel.Department.count();
//       let totalBanks = await BaseModel.Bank.count();
//       let payrolls = await BaseModel.Payroll.findAll({
//         order: [['createdAt', 'DESC']],
//       });
//       let monthlySalaries = 0.0;
//       let bankSchedule = [];

//       // calculate annual payroll
//       let annualPayroll = await BaseModel.Salary.findAll({
//         attributes: [
//           'createdAt',
//           [
//             BaseModel.Sequelize.fn('sum', BaseModel.Sequelize.col('netPay')),
//             'totalNetPay',
//           ],
//         ],
//         where: {
//           createdAt: {
//             [Op.gte]: new Date(from),
//             [Op.lte]: new Date(to),
//           },
//         },
//         group: ['payrollId'],
//       });
//       // calculate annual payroll

//       if (payrolls.length > 0) {
//         let payroll = payrolls[0];
//         monthlySalaries = await BaseModel.Salary.sum('netPay', {
//           where: { payrollId: payroll.id },
//         });

//         // Last Payroll Bank Schedule
//         bankSchedule = await BaseModel.Salary.findAll({
//           attributes: [
//             'bankId',
//             [
//               BaseModel.Sequelize.fn('sum', BaseModel.Sequelize.col('netPay')),
//               'totalNetPay',
//             ],
//           ],
//           where: {
//             payrollId: payroll.id,
//           },
//           include: { model: BaseModel.Bank },
//           group: ['bankId'],
//         });
//         // Last Payroll Bank Schedule
//       }

//       feedback = new Feedback(
//         {
//           totalStaff,
//           totalBanks,
//           totalDepts,
//           monthlySalaries,
//           annualPayroll,
//           bankSchedule,
//         },
//         true,
//         'success'
//       );
//     } else {
//       feedback = generateAuthErrorFeedback();
//     }
//   } catch (error) {
//     console.log(error);
//     feedback = generateErrorFeedback(error);
//   }
//   res.json(feedback);
// };
