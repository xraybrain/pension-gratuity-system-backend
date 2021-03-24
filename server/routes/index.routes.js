const router = require('express').Router();
const BaseModel = require('../db/models/index');
const { GetAuthUser } = require('../lib/AuthManager');
const Feedback = require('../lib/Feedback');
const {
  generateErrorFeedback,
  generateAuthErrorFeedback,
} = require('../lib/models/ErrorHandler');
const mailer = require('../services/mailer');
router.get('/levels/', async (req, res, next) => {
  let feedback;
  try {
    let levels = await BaseModel.Level.findAll({});
    feedback = new Feedback(levels, true, 'success');
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }
  res.json(feedback);
});
router.get('/grades/', async (req, res, next) => {
  let feedback;
  try {
    let grades = await BaseModel.Grade.findAll({});
    feedback = new Feedback(grades, true, 'success');
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }
  res.json(feedback);
});

router.get('/staff/classes/', async (req, res, next) => {
  let feedback;
  try {
    let staffClasses = await BaseModel.StaffClass.findAll({});
    feedback = new Feedback(staffClasses, true, 'success');
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }
  res.json(feedback);
});

router.post('/mail/send/', async (req, res, next) => {
  let feedback;
  let { formData, authorization } = req.body;
  let authUser = GetAuthUser(authorization);
  if (authUser) {
    try {
      let info = await mailer({
        to: formData.to,
        from: '<myproject2019@aol.com>',
        text: formData.text,
        subject: formData.subject,
      });
      console.log(info);
      feedback = new Feedback(info.response, true, 'success');
    } catch (error) {
      feedback = generateErrorFeedback(error);
    }
  } else {
    feedback = generateAuthErrorFeedback();
  }
  res.json(feedback);
});

module.exports = router;
