exports.NextOfKin = class {
  constructor(
    prId = null,
    bankId = null,
    surname = null,
    firstname = null,
    othername = null,
    gender = null,
    phone = null,
    address = null,
    accountNo = null,
    relationship = null,
    id = null
  ) {
    if (prId) this.prId = prId;
    if (bankId) this.bankId = bankId;
    if (surname) this.surname = surname;
    if (firstname) this.firstname = firstname;
    if (othername) this.othername = othername;
    if (gender) this.gender = gender;
    if (accountNo) this.accountNo = accountNo;
    if (phone) this.phone = phone;
    if (address) this.address = address;
    if (relationship) this.relationship = relationship;
    if (id) this.id = id;
  }
};

exports.createNextOfKin = (formData = {}) => {
  return new this.NextOfKin(
    formData.prId,
    formData.bankId,
    formData.surname,
    formData.firstname,
    formData.othername,
    formData.gender,
    formData.phone,
    formData.address,
    formData.accountNo,
    formData.relationship,
    formData.id
  );
};
