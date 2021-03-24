const BaseModel = require('../db/models/index');
const { Op } = BaseModel.Sequelize;
const Feedback = require('../lib/Feedback');
const {
  createData,
  updateData,
  deleteData,
  dataExists,
  isEmpty,
  validateSalaryStructure,
} = require('../lib/helpers');
const Pager = require('../lib/Pager');
const Sanitizer = require('../lib/Sanitizer');
const {
  generateErrorFeedback,
  generateAuthErrorFeedback,
  generateFormErrorFeedack,
  generatePermissionErrorFeedback,
} = require('../lib/models/ErrorHandler');
const { GetAuthUser } = require('../lib/AuthManager');
const { createSalaryStructure } = require('../lib/models/SalaryStructure');
const { excelReader } = require('../services/excel-reader');
const { createSalaryStrList } = require('../lib/models/SalaryStrList');
const Model = 'SalaryStructure';

exports.getSalaryStructures = async (req, res, next) => {
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
          title: {
            [Op.like]: `%${searchquery}%`,
          },
        },
      ];
    }

    let pager = new Pager(Model, limit, page);
    feedback = await pager.getData(
      filter,
      [
        {
          model: BaseModel.SalaryStructureList,
        },
      ],
      [['createdAt', 'DESC']],
      paginate
    );
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }

  res.json(feedback);
};

exports.saveSalaryStructure = async (req, res, next) => {
  let feedback = Sanitizer.sanitize(req.body);
  let transaction = await BaseModel.sequelize.transaction();

  if (feedback.success) {
    try {
      let { formData, uploadURL, fileName } = feedback.result;
      formData = JSON.parse(formData);
      let salaryStrData = createSalaryStructure(formData);
      let salaryStrListJSON = excelReader(uploadURL);
      let errors = {};

      validateSalaryStructure(errors, salaryStrData);
      if (isEmpty(errors)) {
        // ok
        let salaryStrExists = await dataExists(Model, {
          name: salaryStrData.name,
          shortName: salaryStrData.shortName,
        });
        if (salaryStrExists)
          return res.send(
            new Feedback(null, false, `${salaryStrData.name} already exists`)
          );
        // create salary structure
        feedback = await createData(Model, salaryStrData, null, transaction);
        if (feedback.success) {
          let structureId = feedback.result.id;
          // instance
          let salaryStrList = createSalaryStrList(
            salaryStrListJSON.Sheet1,
            structureId
          );
          // create salary list
          feedback = await createData(
            'SalaryStructureList',
            salaryStrList,
            [],
            transaction,
            true
          );
          if (feedback.success) {
            // commit changes
            await transaction.commit();
            // retireve just inserted record
            let salaryStructure = await BaseModel[Model].findOne({
              where: { id: structureId },
              include: [
                {
                  model: BaseModel.SalaryStructureList,
                },
              ],
            });
            feedback = new Feedback(salaryStructure, true, 'success');
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

exports.updateSalaryStructure = async (req, res, next) => {
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback;
  if (authUser) {
    try {
      let salaryStrData = createSalaryStructure(formData);
      let errors = {};
      validateSalaryStructure(errors, salaryStrData, true);
      if (isEmpty(errors)) {
        // ok
        feedback = await updateData(Model, salaryStrData, {
          id: salaryStrData.id,
        });
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

exports.deleteSalaryStructure = async (req, res, next) => {
  let transaction = await BaseModel.sequelize.transaction();
  let { id, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback;
  try {
    if (authUser) {
      result = await deleteData(
        Model,
        {
          field: 'id',
          value: id,
        },
        transaction
      );

      if (result) {
        result = await deleteData(
          'SalaryStructureList',
          {
            field: 'structureId',
            value: id,
          },
          transaction
        );
        // commit transaction
        if (result) await transaction.commit();
      }

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

exports.saveSalaryStructureList = async (req, res, next) => {
  let feedback = Sanitizer.sanitize(req.body);
  let transaction = await BaseModel.sequelize.transaction();

  if (feedback.success) {
    try {
      let salaryStrData = createSalaryStructure(feedback.result);
      let salaryStrListJSON = excelReader(feedback.result.uploadURL);
      let errors = {};

      validateSalaryStructure(errors, salaryStrData, true);
      if (isEmpty(errors)) {
        // ok
        let structureId = salaryStrData.id;
        if (!structureId) {
          return res.json(
            new Feedback(
              null,
              false,
              'Please select the salary structure to be updated.'
            )
          );
        }

        // clear previous data stored for this salary structure
        await BaseModel.SalaryStructureList.destroy(
          {
            where: { structureId },
            force: true,
          },
          {
            transaction,
          }
        );

        // instance
        let salaryStrList = createSalaryStrList(
          salaryStrListJSON.Sheet1,
          structureId
        );

        // create salary structure list
        feedback = await createData(
          'SalaryStructureList',
          salaryStrList,
          [],
          transaction,
          true
        );
        if (feedback.success) {
          // commit changes
          await transaction.commit();
          // retireve just inserted record
          let salaryStructure = await BaseModel[Model].findOne({
            where: { id: structureId },
            include: [
              {
                model: BaseModel.SalaryStructureList,
                group: ['structureId', 'level'],
              },
            ],
          });
          feedback = new Feedback(salaryStructure, true, 'success');
        }
      } else {
        feedback = generateFormErrorFeedack(errors);
      }
    } catch (error) {
      console.log(error);
      feedback = generateErrorFeedback(error);
      await transaction.rollback();
    }
  }

  res.json(feedback);
};
