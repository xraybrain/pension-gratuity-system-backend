const BaseModel = require('../db/models/index');
const { Op } = BaseModel.Sequelize;
const Feedback = require('../lib/Feedback');
const {
  createData,
  updateData,
  deleteData,
  dataExists,
  isEmpty,
  validateComplaintChat,
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
const { createComplaint } = require('../lib/models/Complaint');
const { Constants } = require('../lib/models/Constants');
const { createComplaintChat } = require('../lib/models/ComplaintChat');
const Model = 'ComplaintChat';

exports.getComplaintChat = async (req, res, next) => {
  let feedback;
  let page = Number(req.query.page) || 1;
  let paginate = req.query.paginate === 'false' ? false : true;
  let limit = Number(req.query.limit) || 10;
  let { searchquery, cid } = req.query;

  try {
    let filter = {};
    if (searchquery) {
      filter[Op.or] = [
        {
          reply: {
            [Op.like]: `%${searchquery}%`,
          },
        },
      ];
    }

    if (cid) filter.complaintId = cid;

    let pager = new Pager(Model, limit, page);
    feedback = await pager.getData(
      filter,
      Constants.ComplaintChatInclude,
      [['createdAt', 'DESC']],
      paginate
    );
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }

  res.json(feedback);
};

exports.saveComplaintChat = async (req, res, next) => {
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback = new Feedback({}, false, 'failed');
  if (authUser) {
    try {
      let loginId = authUser.login;

      //TODO: get logged in user from authuser
      let complaintChatData = createComplaintChat(formData, loginId);
      let errors = {};
      validateComplaintChat(errors, complaintChatData);
      if (isEmpty(errors)) {
        // ok
        feedback = await createData(
          Model,
          complaintChatData,
          Constants.ComplaintChatInclude
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

exports.updateComplaintChat = async (req, res, next) => {
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization) || true;
  let feedback;
  if (authUser) {
    try {
      let complaintChatData = createComplaintChat(formData);
      let errors = {};
      validateComplaintChat(errors, complaintChatData, true);
      if (isEmpty(errors)) {
        // ok
        feedback = await updateData(
          Model,
          complaintChatData,
          {
            id: complaintChatData.id,
          },
          Constants.ComplaintChatInclude
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

exports.deleteComplaintChat = async (req, res, next) => {
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
