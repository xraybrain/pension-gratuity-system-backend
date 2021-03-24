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
  validateUser,
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
const { createUser } = require('../lib/models/User');
const { validate } = require('../lib/validator.helper');
const { PaymentType } = require('../lib/models/PaymentType');
const Model = 'User';

exports.getUsers = async (req, res, next) => {
  let feedback;
  let page = Number(req.query.page) || 1;
  let paginate = req.query.paginate === 'false' ? false : true;
  let limit = Number(req.query.limit) || 20;
  let { searchquery } = req.query;

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

    let pager = new Pager(Model, limit, page);
    feedback = await pager.getData(
      filter,
      [{ model: BaseModel.Login }],
      [['surname', 'ASC']],
      paginate
    );
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }

  res.json(feedback);
};

exports.saveUser = async (req, res, next) => {
  let feedback = new Feedback(null, false, '');
  feedback = req.body;
  // let { formData } = req.body; //TODO: remove after test

  if (feedback.success) {
    try {
      // extract form data
      let { formData, uploadURL, fileName } = feedback.result;
      formData = JSON.parse(formData);
      formData.fileName = fileName || uploadURL || 'avatar.png';
      let userData = createUser(formData);
      let errors = {};
      validateUser(errors, userData);
      if (formData.loginId) {
        // already has login id
        if (isEmpty(errors)) {
          feedback = await createData(Model, userData, [
            { model: BaseModel.Login },
          ]);
        } else {
          feedback = generateFormErrorFeedack(errors);
        }
      } else {
        let loginData = createLogin(formData.Login, UserType.Admin);
        validateLogin(errors, loginData);
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
            userData.loginId = loginId;
            // create user
            feedback = await createData(Model, userData, [], transaction);
            // User Created
            if (feedback.success) {
              let userId = feedback.result.id;
              await transaction.commit();
              let user = await BaseModel[Model].findOne({
                where: { id: userId },
                include: [{ model: BaseModel.Login }],
              });
              feedback = new Feedback(user, true, 'success');
            }
          }
        } else {
          feedback = generateFormErrorFeedack(errors);
        }
      }
    } catch (error) {
      console.log(error);
      feedback = generateErrorFeedback(error);
    }
  }

  res.json(feedback);
};

exports.changeUserPassport = async (req, res, next) => {
  let feedback = new Feedback(null, false, '');
  feedback = req.body;

  if (feedback.success) {
    try {
      // extract form data
      let { formData, id, uploadURL, fileName } = feedback.result;
      let imageUrl;

      if (process.env.NODE_ENV === 'production') {
        imageUrl = uploadURL;
      } else {
        imageUrl = '/assets/uploads/' + fileName;
      }
      await updateData('User', { imageUrl }, { id });
      feedback = new Feedback(imageUrl, true, 'success');
    } catch (error) {
      console.log(error);
      feedback = generateErrorFeedback(error);
    }
  }

  res.json(feedback);
};

exports.updateUser = async (req, res, next) => {
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization) || true;
  let feedback;
  if (authUser) {
    try {
      let userData = createUser(formData);
      let loginData = createLogin(formData.Login);

      let errors = {};
      validateUser(errors, userData, true);
      validateLogin(errors, loginData, true);

      if (isEmpty(errors)) {
        if (loginData) loginData.password = encryptPassword(loginData.password);
        // ok
        feedback = await updateData('Login', loginData, {
          id: loginData.id,
        });
        feedback = await updateData(
          Model,
          userData,
          {
            id: userData.id,
          },
          [{ model: BaseModel.Login }]
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

exports.deleteUser = async (req, res, next) => {
  let { id, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization) || true;
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

exports.userDashboard = async (req, res, next) => {
  let feedback;
  let { authorization } = req.query;
  let authUser = GetAuthUser(authorization);

  try {
    if (authUser) {
      let d = new Date();
      let from = `${d.getFullYear()}-1-1`;
      let to = `${d.getFullYear()}-12-31`;
      let totalPensioneer = await BaseModel.Pensioneer.count();
      let totalUsers = await BaseModel.User.count();
      let totalDepts = await BaseModel.Department.count();
      let totalBanks = await BaseModel.Bank.count();

      // calculate monthly pension since current year
      let monthlyPensions = await BaseModel.Emolument.findAll({
        attributes: [
          'createdAt',
          [
            BaseModel.Sequelize.fn('sum', BaseModel.Sequelize.col('netPay')),
            'totalNetPay',
          ],
        ],
        where: {
          createdAt: {
            [Op.gte]: new Date(from),
            [Op.lte]: new Date(to),
          },
        },
        include: [
          { model: BaseModel.Payment, where: { type: PaymentType.Pension } },
        ],
        group: ['paymentId'],
      });

      const YearsGap = 5;
      from = `${d.getFullYear() - YearsGap}-1-1`;
      to = `${d.getFullYear()}-12-31`;

      let yearlyGratuity = await BaseModel.Emolument.findAll({
        attributes: [
          'createdAt',
          [
            BaseModel.Sequelize.fn('sum', BaseModel.Sequelize.col('netPay')),
            'totalNetPay',
          ],
        ],
        where: {
          createdAt: {
            [Op.gte]: new Date(from),
            [Op.lte]: new Date(to),
          },
        },
        include: [
          { model: BaseModel.Payment, where: { type: PaymentType.Gratuity } },
        ],
        group: ['paymentId'],
      });
      
      feedback = new Feedback(
        {
          totalPensioneer,
          totalUsers,
          totalBanks,
          totalDepts,
          yearlyGratuity,
          monthlyPensions,
        },
        true,
        'success'
      );
    } else {
      feedback = generateAuthErrorFeedback();
    }
  } catch (error) {
    console.log(error);
    feedback = generateErrorFeedback(error);
  }
  res.json(feedback);
};
