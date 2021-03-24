exports.Pensioneer = class {
  constructor(
    loginId = null,
    deptId = null,
    dsgId = null,
    classId = null,
    structureId = null,
    bankId = null,
    level = null,
    grade = null,
    surname = null,
    firstname = null,
    othername = null,
    gender = null,
    dateOfEmp = null,
    dateOfRet = null,
    accountNo = null,
    imageUrl = null,
    phone = null,
    address = null,
    id = null
  ) {
    if (loginId) this.loginId = loginId;
    if (deptId) this.deptId = deptId;
    if (dsgId) this.dsgId = dsgId;
    if (classId) this.classId = classId;
    if (structureId) this.structureId = structureId;
    if (bankId) this.bankId = bankId;
    if (level) this.level = level;
    if (grade) this.grade = grade;
    if (surname) this.surname = surname;
    if (firstname) this.firstname = firstname;
    if (othername) this.othername = othername;
    if (gender) this.gender = gender;
    if (dateOfEmp) this.dateOfEmp = dateOfEmp;
    if (dateOfRet) this.dateOfRet = dateOfRet;
    if (accountNo) this.accountNo = accountNo;
    if (imageUrl) this.imageUrl = imageUrl;
    if (phone) this.phone = phone;
    if (address) this.address = address;
    if (id) this.id = id;
  }
};

exports.createPensioneer = (formData = {}) => {
  let imageUrl;
  if (process.env.NODE_ENV === 'production' && formData.fileName) {
    imageUrl = formData.fileName || '/assets/avatar.png';
  } else if (formData.fileName) {
    imageUrl = `/assets/uploads/${formData.fileName}`;
  } else {
    imageUrl = formData.imageUrl;
  }
  return new this.Pensioneer(
    formData.loginId,
    formData.deptId,
    formData.dsgId,
    formData.classId,
    formData.structureId,
    formData.bankId,
    formData.level,
    formData.grade,
    formData.surname,
    formData.firstname,
    formData.othername,
    formData.gender,
    formData.dateOfEmp,
    formData.dateOfRet,
    formData.accountNo,
    imageUrl,
    formData.phone,
    formData.address,
    formData.id
  );
};
