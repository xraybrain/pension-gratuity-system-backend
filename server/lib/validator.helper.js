const Validator = require('./Validator');
const FormError = require('./models/FormError');
exports.validate = {
  email: (errors = {}, formData = {}, isUpdating = false) => {
    if (isUpdating) {
      if (formData.email && !Validator.isEmail(formData.email)) {
        errors['email'] = new FormError('Please provide a valid email.');
      }
      if (formData.email && Validator.isEmpty(formData.email)) {
        errors['email'] = new FormError('Email field is required.');
      }
    } else {
      if (!Validator.isEmail(formData.email)) {
        errors['email'] = new FormError('Please provide a valid email.');
      }
      if (Validator.isEmpty(formData.email)) {
        errors['email'] = new FormError('Email field is required.');
      }
    }
  },

  password: (errors = {}, formData = {}, isUpdating = false) => {
    if (isUpdating) {
      if (formData.password && Validator.isEmpty(formData.password)) {
        errors['password'] = new FormError('Password field is required.');
      }
    } else {
      if (Validator.isEmpty(formData.password)) {
        errors['password'] = new FormError('Password field is required.');
      }
    }
  },

  surname: (errors = {}, formData = {}, isUpdating = false) => {
    if (isUpdating) {
      if (formData.surname && !Validator.isRealName(formData.surname)) {
        errors['surname'] = new FormError('Please provide a valid surname.', [
          'no digit or special characters',
        ]);
      }

      if (formData.surname && Validator.isEmpty(formData.surname)) {
        errors['surname'] = new FormError('Surname field is required.');
      }
    } else {
      if (!Validator.isRealName(formData.surname)) {
        errors['surname'] = new FormError('Please provide a valid surname.', [
          'no digit or special characters',
        ]);
      }

      if (Validator.isEmpty(formData.surname)) {
        errors['surname'] = new FormError('Surname field is required.');
      }
    }
  },

  othernames: (errors = {}, formData = {}, isUpdating = false) => {
    if (isUpdating) {
      if (formData.otherNames && !Validator.isRealNames(formData.otherNames)) {
        errors[
          'othernames'
        ] = new FormError('Please provide a valid othernames.', [
          'no digit or special characters',
        ]);
      }
      if (formData.otherNames && Validator.isEmpty(formData.othernames)) {
        errors['othernames'] = new FormError('Othernames field is required.');
      }
    } else {
      if (!Validator.isRealNames(formData.otherNames)) {
        errors[
          'othernames'
        ] = new FormError('Please provide a valid othernames.', [
          'no digit or special characters',
        ]);
      }
      if (Validator.isEmpty(formData.othernames)) {
        errors['othernames'] = new FormError('Othernames field is required.');
      }
    }
  },

  mobile: (errors = {}, formData = {}, isUpdating = false) => {
    if (isUpdating) {
      if (formData.mobile && Validator.isMobile(formData.mobile)) {
        errors['mobile'] = new FormError(
          'Please provide a valid mobile number.'
        );
      }
      if (formData.mobile && Validator.isEmpty(formData.mobile)) {
        errors['mobile'] = new FormError('Mobile field is required.');
      }
    } else {
      if (Validator.isMobile(formData.mobile)) {
        errors['mobile'] = new FormError(
          'Please provide a valid mobile number.'
        );
      }
      if (Validator.isEmpty(formData.mobile)) {
        errors['mobile'] = new FormError('Mobile field is required.');
      }
    }
  },

  isFieldEmpty: (
    errors = {},
    formData = {},
    form = { field: null, as: null, replace: null },
    isUpdating = false
  ) => {
    if (isUpdating) {
      if (formData[form.field] && Validator.isEmpty(formData[form.field])) {
        errors[form.replace || form.field] = new FormError(
          `${form.as || form.field} field is required.`
        );
      }
    } else {
      if (Validator.isEmpty(formData[form.field])) {
        errors[form.replace || form.field] = new FormError(
          `${form.as || form.field} field is required.`
        );
      }
    }
  },
};
