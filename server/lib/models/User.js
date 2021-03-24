const UserType = require('./UserType');

exports.User = class User {
  constructor(
    surname = null,
    firstname = null,
    othername = null,
    gender = null,
    phone = null,
    imageUrl = null,
    loginId = null,
    userType = null,
    id = null
  ) {
    if (surname) this.surname = surname;
    if (firstname) this.firstname = firstname;
    if (othername) this.othername = othername;
    if (gender) this.gender = gender;
    if (phone) this.phone = phone;
    if (imageUrl) this.imageUrl = imageUrl;
    if (loginId) this.loginId = loginId;
    if (userType) this.userType = userType;
    if (id) this.id = id;
  }
};

exports.createUser = (formData = {}) => {
  let imageUrl;
  if (process.env.NODE_ENV === 'production') {
    imageUrl = formData.fileName;
  } else if (formData.fileName) {
    imageUrl = '/assets/uploads/' + formData.fileName;
  } else {
    imageUrl = formData.imageUrl;
  }
  return new this.User(
    formData.surname,
    formData.firstname,
    formData.othername,
    formData.gender,
    formData.phone,
    imageUrl,
    formData.loginId,
    UserType.Admin,
    formData.id
  );
};
