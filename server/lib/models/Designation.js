exports.Designation = class {
  constructor(name = null, id = null) {
    if (name) this.name = name;
    if (id) this.id = id;
  }
};

exports.createDesignation = (formData = {}) => {
  return new this.Designation(formData.name, formData.id);
};
