const BaseModel = require('../db/models/index');
const Feedback = require('../lib/Feedback');
const {
  validateLogin,
  isEmpty,
  dataExists,
  createData,
  updateData,
  encryptPassword,
} = require('../lib/helpers');
const {
  generateFormErrorFeedack,
  generateErrorFeedback,
} = require('../lib/models/ErrorHandler');
const { createLogin } = require('../lib/models/Login');

exports.saveLogin = async (req, res, next) => {
  let feedback;
  let { formData } = req.body;
  try {
    let loginData = createLogin(formData);
    let errors = {};
    validateLogin(errors, loginData);
    if (isEmpty(errors)) {
      // ok
      let emailExists = await dataExists('Login', { email: loginData.email });
      if (emailExists)
        return res.json(new Feedback(null, false, 'Email already exists'));

      loginData.password = encryptPassword(loginData.password);
      // insert data
      feedback = await createData('Login', loginData);
      if (formData.staffId) {
        // link login with staff
        let feedback = await updateData(
          'Staff',
          { loginId: feedback.result.id },
          { id: formData.staffId }
        );
      }
    } else {
      feedback = generateFormErrorFeedack(errors);
    }
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }
  res.json(feedback);
};

exports.updateLogin = async (req, res, next) => {
  let feedback;
  let { formData } = req.body;
  try {
    let loginData = createLogin(formData);
    let errors = {};
    validateLogin(errors, loginData, true);
    if (isEmpty(errors)) {
      // ok
      if (loginData.password)
        loginData.password = encryptPassword(loginData.password);
      // update data
      feedback = await updateData('Login', loginData, { id: loginData.id });
    } else {
      feedback = generateFormErrorFeedack(errors);
    }
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }
  res.json(feedback);
};

exports.getEmail = async (req, res, next) => {
  let feedback;
  let { email } = req.params;
  try {
    let login = await BaseModel.Login.findOne({ where: { email } });
    feedback = new Feedback(login, true, 'success');
    if(!login)feedback.message = "no user found"
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }
  res.json(feedback);
};
