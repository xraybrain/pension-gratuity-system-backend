const BaseModel = require('../db/models/index');
const { Op } = BaseModel.Sequelize;
const Feedback = require('../lib/Feedback');
const {
  createData,
  updateData,
  deleteData,
  dataExists,
  isEmpty,
  validateComplaint,
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
const {
  createComplaint,
  ComplaintReadStatus,
} = require('../lib/models/Complaint');
const { Constants } = require('../lib/models/Constants');
const Model = 'Complaint';

exports.getComplaints = async (req, res, next) => {
  let feedback;
  let page = Number(req.query.page) || 1;
  let paginate = req.query.paginate === 'false' ? false : true;
  let limit = Number(req.query.limit) || 10;
  let { searchquery, singleuser, authorization } = req.query;
  let authUser = GetAuthUser(authorization);

  try {
    let filter = {};
    if (searchquery) {
      filter[Op.or] = [
        {
          content: {
            [Op.like]: `%${searchquery}%`,
          },
        },
      ];
    }

    if (authUser && singleuser === 'true') {
      let loginId = authUser.login;
      let pensioneer = await BaseModel.Pensioneer.findOne({
        where: { loginId },
      });
      filter.prId = pensioneer.id;
    }

    console.log(filter, 'Filter');

    let pager = new Pager(Model, limit, page);
    feedback = await pager.getData(
      filter,
      Constants.ComplaintInclude,
      [['createdAt', 'DESC']],
      paginate,
      [
        'id',
        'prId',
        'content',
        'status',
        'readStatus',
        'createdAt',
        // [
        //   BaseModel.Sequelize.fn(
        //     'COUNT',
        //     BaseModel.Sequelize.col('ComplaintChat.id')
        //   ),
        //   'replies',
        // ],
      ]
    );
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }
  feedback.isLoggedIn = authUser ? true : false;
  res.json(feedback);
};

exports.getComplaint = async (req, res, next) => {
  let { authorization } = req.query;
  let { cid } = req.params;
  let authUser = GetAuthUser(authorization) || true;
  let feedback;

  if (authUser) {
    try {
      let complaint = await BaseModel.Complaint.findOne({
        where: { id: cid },
        include: Constants.ComplaintInclude,
      });
      feedback = new Feedback(complaint, true, 'success');
    } catch (error) {
      console.log(error);
      feedback = generateErrorFeedback(error);
    }
  } else {
    feedback = generateAuthErrorFeedback();
  }

  res.json(feedback);
};

exports.saveComplaint = async (req, res, next) => {
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback = new Feedback({}, false, 'failed');
  if (authUser) {
    try {
      let loginId = authUser.login;
      let pensioneerId;
      let pensioneer = await BaseModel.Pensioneer.findOne({
        where: { loginId },
      });

      if (pensioneer) {
        pensioneerId = pensioneer.id;
      }

      //TODO: get logged in pensioneers from authuser
      let complaintData = createComplaint(formData, pensioneerId);
      let errors = {};
      console.log(complaintData);

      validateComplaint(errors, complaintData);
      if (isEmpty(errors)) {
        // ok
        feedback = await createData(Model, complaintData, [
          { model: BaseModel.Pensioneer },
        ]);
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

exports.updateComplaint = async (req, res, next) => {
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback;
  if (authUser) {
    try {
      let complaintData = createComplaint(formData);
      let errors = {};
      validateComplaint(errors, complaintData, true);
      if (isEmpty(errors)) {
        // ok
        feedback = await updateData(
          Model,
          complaintData,
          {
            id: complaintData.id,
          },
          [{ model: BaseModel.Pensioneer }]
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

exports.deleteComplaint = async (req, res, next) => {
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

exports.countUnreadComplaints = async (req, res, next) => {
  let { authorization } = req.query;
  let authUser = GetAuthUser(authorization);
  let feedback;

  if (authUser) {
    try {
      let totalUnread = await BaseModel.Complaint.count({
        where: { readStatus: ComplaintReadStatus.UnRead },
      });
      feedback = new Feedback(totalUnread, true, 'success');
    } catch (error) {
      console.log(error);
      feedback = generateErrorFeedback(error);
    }
  } else {
    feedback = generateAuthErrorFeedback();
  }
  res.json(feedback);
};

exports.markComplaintsAsRead = async (req, res, next) => {
  let { authorization, formData } = req.body;
  let authUser = GetAuthUser(authorization);
  let feedback, complaintData;
  if (authUser) {
    try {
      complaintData = createComplaint(formData);
      feedback = await updateData(Model, complaintData);
    } catch (error) {
      console.log(error);
      feedback = generateErrorFeedback(error);
    }
  } else {
    feedback = generateAuthErrorFeedback();
  }
  res.json(feedback);
};
