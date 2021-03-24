const bcrypt = require('bcryptjs');
const BaseModel = require('../db/models');
const Validator = require('./Validator');
const FormError = require('./models/FormError');
const { generateErrorFeedback } = require('./models/ErrorHandler');
const Feedback = require('./Feedback');
const { validate } = require('./validator.helper');

exports.dataExists = async (model, whereClause = {}) => {
  return await BaseModel[model].findOne({
    where: whereClause,
  });
};

exports.encryptPassword = (password) => {
  let salt = bcrypt.genSaltSync(12);
  let hash = bcrypt.hashSync(String(password), salt);
  return hash;
};

const validateCredentials = (errors = {}, formData, isUpdating = false) => {
  validate.email(errors, formData, isUpdating);
  validate.password(errors, formData, isUpdating);
  validate.isFieldEmpty(
    errors,
    formData,
    {
      field: 'userType',
      as: 'User Type',
    },
    isUpdating
  );
};

const validateNames = (errors = {}, formData = {}, isUpdating = false) => {
  validate.surname(errors, formData, isUpdating);
  validate.isFieldEmpty(errors, formData, { field: 'surname' }, isUpdating);
  validate.isFieldEmpty(errors, formData, { field: 'firstname' }, isUpdating);
};

exports.validateLogin = (errors = {}, formData = {}, isUpdating = false) => {
  validateCredentials(errors, formData, isUpdating);
};

exports.validatePensioneer = (
  errors = {},
  formData = {},
  isUpdating = false
) => {
  validateNames(errors, formData, isUpdating);
  validate.isFieldEmpty(
    errors,
    formData,
    {
      field: 'deptId',
      as: 'Department',
    },
    isUpdating
  );
  validate.isFieldEmpty(
    errors,
    formData,
    {
      field: 'dsgId',
      as: 'Designation',
    },
    isUpdating
  );
  validate.isFieldEmpty(
    errors,
    formData,
    {
      field: 'classId',
      as: 'Staff Class',
    },
    isUpdating
  );
  validate.isFieldEmpty(
    errors,
    formData,
    {
      field: 'structureId',
      as: 'Salary Structure',
    },
    isUpdating
  );
  validate.isFieldEmpty(
    errors,
    formData,
    { field: 'bankId', as: 'Bank' },
    isUpdating
  );
  validate.isFieldEmpty(errors, formData, { field: 'level' }, isUpdating);
  validate.isFieldEmpty(errors, formData, { field: 'grade' }, isUpdating);
  validate.isFieldEmpty(errors, formData, { field: 'gender' }, isUpdating);
  validate.isFieldEmpty(
    errors,
    formData,
    {
      field: 'dateOfEmp',
      as: 'Date of employment',
    },
    isUpdating
  );
  validate.isFieldEmpty(
    errors,
    formData,
    { field: 'dateOfRet', as: 'Date of retirement' },
    isUpdating
  );
  validate.isFieldEmpty(
    errors,
    formData,
    {
      field: 'accountNo',
      as: 'Account No.',
    },
    isUpdating
  );
  validate.isFieldEmpty(
    errors,
    formData,
    { field: 'phone', as: 'Phone No.' },
    isUpdating
  );
  validate.isFieldEmpty(errors, formData, { field: 'address' }, isUpdating);
  validate.isFieldEmpty(errors, formData, { field: 'imageUrl' }, isUpdating);
};

exports.validateNextOfKin = (
  errors = {},
  formData = {},
  isUpdating = false
) => {
  validateNames(errors, formData, isUpdating);
  validate.isFieldEmpty(
    errors,
    formData,
    { field: 'bankId', as: 'Bank', replace: 'nokBankId' },
    isUpdating
  );

  validate.isFieldEmpty(
    errors,
    formData,
    { field: 'relationship' },
    isUpdating
  );

  validate.isFieldEmpty(
    errors,
    formData,
    { field: 'gender', replace: 'nokGender' },
    isUpdating
  );
  validate.isFieldEmpty(
    errors,
    formData,
    {
      field: 'accountNo',
      as: 'Account No.',
      replace: 'nokAccountNo',
    },
    isUpdating
  );
  validate.isFieldEmpty(
    errors,
    formData,
    { field: 'phone', as: 'Phone No.', replace: 'nokPhone' },
    isUpdating
  );
  validate.isFieldEmpty(
    errors,
    formData,
    { field: 'address', replace: 'nokAddress' },
    isUpdating
  );
};

exports.validateUser = (errors = {}, formData = {}, isUpdating = false) => {
  validateNames(errors, formData, isUpdating);
  validate.isFieldEmpty(
    errors,
    formData,
    { field: 'phone', as: 'Phone No.' },
    isUpdating
  );

  validate.isFieldEmpty(errors, formData, { field: 'gender' }, isUpdating);
  validate.isFieldEmpty(errors, formData, { field: 'imageUrl' }, isUpdating);
};

exports.validateDepartment = (errors = {}, formData, isUpdating = false) => {
  validate.isFieldEmpty(
    errors,
    formData,
    { field: 'name', as: 'Department Name' },
    isUpdating
  );
};

exports.validateBank = (errors = {}, formData, isUpdating = false) => {
  validate.isFieldEmpty(
    errors,
    formData,
    { field: 'name', as: 'Bank Name' },
    isUpdating
  );
};

exports.validateDesignation = (errors = {}, formData, isUpdating = false) => {
  validate.isFieldEmpty(
    errors,
    formData,
    { field: 'name', as: 'Designation Name' },
    isUpdating
  );
};

exports.validateMiscellanous = (errors = {}, formData, isUpdating = false) => {
  validate.isFieldEmpty(errors, formData, { field: 'title' }, isUpdating);
  validate.isFieldEmpty(
    errors,
    formData,
    { field: 'isCalculated', as: 'Calculated' },
    isUpdating
  );
  validate.isFieldEmpty(errors, formData, { field: 'category' }, isUpdating);

  if (formData.isCalculated) {
    validate.isFieldEmpty(errors, formData, { field: 'percent' }, isUpdating);
    validate.isFieldEmpty(
      errors,
      formData,
      { field: 'derivedFrom', as: 'Derived From' },
      isUpdating
    );
  } else {
    validate.isFieldEmpty(errors, formData, { field: 'amount' }, isUpdating);
  }
};

exports.validatePayment = (errors = {}, formData, isUpdating = false) => {
  validate.isFieldEmpty(errors, formData, { field: 'title' }, isUpdating);
};

exports.validateSalaryStructure = (
  errors = {},
  formData,
  isUpdating = false
) => {
  validate.isFieldEmpty(errors, formData, { field: 'name' }, isUpdating);
  validate.isFieldEmpty(errors, formData, { field: 'shortName' }, isUpdating);
};

exports.validateSalary = (errors = {}, formData, isUpdating = false) => {
  validate.isFieldEmpty(errors, formData, { field: 'status' }, isUpdating);
  validate.isFieldEmpty(errors, formData, { field: 'id' }, isUpdating);
};

exports.validateNews = (errors = {}, formData, isUpdating = false) => {
  validate.isFieldEmpty(errors, formData, { field: 'title' }, isUpdating);
  validate.isFieldEmpty(errors, formData, { field: 'content' }, isUpdating);
};

exports.validateComplaint = (errors = {}, formData, isUpdating = false) => {
  validate.isFieldEmpty(errors, formData, { field: 'content' }, isUpdating);
};

exports.validateComplaintChat = (errors = {}, formData, isUpdating = false) => {
  validate.isFieldEmpty(errors, formData, { field: 'reply' }, isUpdating);
  validate.isFieldEmpty(
    errors,
    formData,
    { field: 'complaintId', as: 'complaint' },
    isUpdating
  );
};

exports.deleteData = async (
  model,
  query = { field: '', value: '' },
  transaction = null
) => {
  try {
    let result = await BaseModel[model].destroy(
      {
        where: { [query.field]: query.value },
      },
      {
        transaction,
      }
    );
    return result;
  } catch (error) {
    console.log(error);
    if (transaction) await transaction.rollback();
    return null;
  }
};

exports.createData = async (
  model,
  data,
  include = null,
  transaction = null,
  isBulkInsert = false,
  updateOnDuplicate = null
) => {
  let inserted;
  let feedback;
  try {
    if (isBulkInsert) {
      let options = {
        transaction,
      };
      if (updateOnDuplicate) options.updateOnDuplicate = updateOnDuplicate;
      inserted = await BaseModel[model].bulkCreate(data, options);
    } else {
      let newData = await BaseModel[model].create(data, { transaction });
      if (transaction) {
        newData.id = newData.null;
        inserted = newData;
      } else {
        inserted = await BaseModel[model].findOne({
          where: { id: newData.null },
          include,
        });
      }
    }
    feedback = new Feedback(inserted, true, 'success');
  } catch (error) {
    console.log(error);
    if (transaction) await transaction.rollback();
    feedback = generateErrorFeedback(error);
  }
  return feedback;
};

exports.updateData = async (
  model,
  data,
  whereClause = {},
  include = [],
  transaction = null
) => {
  let updated;
  let feedback;
  try {
    updated = await BaseModel[model].update(
      data,
      { where: whereClause },
      { transaction }
    );
    if (!this.isEmpty(whereClause))
      updated = await BaseModel[model].findOne({ where: whereClause, include });
    feedback = new Feedback(updated, true, 'success');
  } catch (error) {
    console.log(error);
    if (transaction) await transaction.rollback();
    feedback = generateErrorFeedback(error);
  }
  return feedback;
};

exports.isEmpty = (value) => {
  if (value && typeof value == 'object') {
    if (Array.isArray(value)) {
      if (value.length === 0) return true;
    } else if (Object.keys(value).length === 0) return true;
    return false;
  }
  return !Boolean(value);
};
