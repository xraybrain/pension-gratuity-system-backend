const BaseModel = require('../db/models/index');
const { Op } = BaseModel.Sequelize;
const Feedback = require('../lib/Feedback');
const {
  createData,
  updateData,
  deleteData,
  dataExists,
  validateBank,
  isEmpty,
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
const { Constants } = require('../lib/models/Constants');
const { createBank } = require('../lib/models/Bank');

exports.getBanks = async (req, res, next) => {
  let feedback;
  let page = Number(req.query.page) || 1;
  let paginate = req.query.paginate === 'false' ? false : true;
  let limit = Number(req.query.limit) || 10;
  let { searchquery } = req.query;

  try {
    let filter = {};
    if (searchquery) {
      filter[Op.or] = [
        {
          name: {
            [Op.like]: `%${searchquery}%`,
          },
        },
      ];
    }
    let pager = new Pager('Bank', limit, page);
    feedback = await pager.getData(filter, [], [['name', 'ASC']], paginate);
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }
  
  res.json(feedback);
};

exports.saveBank = async (req, res, next) => {
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback;
  if (authUser) {
    try {
      let bankData = createBank(formData);
      let errors = {};
      validateBank(errors, bankData);
      if (isEmpty(errors)) {
        // ok
        let bankExists = await dataExists('Bank', {
          name: bankData.name,
        });
        if (bankExists)
          return res.send(new Feedback(null, false, 'Bank already exists'));
        feedback = await createData('Bank', bankData);
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

exports.updateBank = async (req, res, next) => {
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization) || true;
  let feedback;
  if (authUser) {
    try {
      let bankData = createBank(formData);
      let errors = {};
      validateBank(errors, bankData);
      if (isEmpty(errors)) {
        // ok
        feedback = await updateData('Bank', bankData, { id: bankData.id });
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

exports.deleteBank = async (req, res, next) => {
  let { id, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization) || true;
  let feedback;
  try {
    if (authUser) {
      result = await deleteData('Bank', {
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
