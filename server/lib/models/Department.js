exports.Department = class {
  constructor(name = null, id = null) {
    if (name) this.name = name;
    if (id) this.id = id;
  }
};

exports.createDepartment = (formData = {}) => {
  return new this.Department(formData.name, formData.id);
};
