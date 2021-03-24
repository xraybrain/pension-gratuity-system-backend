const BaseModel = require('../db/models/index');
const { Op } = BaseModel.Sequelize;
const Feedback = require('../lib/Feedback');
const {
  createData,
  updateData,
  deleteData,
  dataExists,
  isEmpty,
  validatePayment,
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
const { createPayment } = require('../lib/models/Payment');
const Model = 'Payment';

exports.getPayments = async (req, res, next) => {
  let feedback;
  let page = Number(req.query.page) || 1;
  let paginate = req.query.paginate === 'false' ? false : true;
  let { searchquery, type, limit } = req.query;
  limit = Number(limit) || 20;

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

    filter.type = type;

    let pager = new Pager(Model, limit, page);
    feedback = await pager.getData(
      filter,
      [],
      [['createdAt', 'ASC']],
      paginate
    );
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }

  res.json(feedback);
};

exports.getPayment = async (req, res, next) => {
  let { id } = req.params;
  let feedback;

  try {
    let payment = await BaseModel.Payment.findByPk(id);
    feedback = new Feedback(payment, true, 'success');
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }
  res.json(feedback);
};

exports.savePayment = async (req, res, next) => {
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback;
  if (authUser) {
    try {
      let paymentData = createPayment(formData);
      let errors = {};
      validatePayment(errors, paymentData);
      if (isEmpty(errors)) {
        // ok
        let titleExists = await dataExists(Model, {
          title: paymentData.title,
        });
        if (titleExists)
          return res.send(
            new Feedback(null, false, `${paymentData.title} already exists`)
          );
        feedback = await createData(Model, paymentData);
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

exports.updatePayment = async (req, res, next) => {
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback;
  if (authUser) {
    try {
      let paymentData = createPayment(formData);
      let errors = {};
      validatePayment(errors, paymentData, true);
      if (isEmpty(errors)) {
        // ok
        feedback = await updateData(Model, paymentData, {
          id: paymentData.id,
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

exports.deletePayment = async (req, res, next) => {
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
