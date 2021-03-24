exports.Bank = class {
  constructor(name, id) {
    this.name = name;
    if (id) this.id = id;
  }
};

exports.createBank = (formData = {}) => {
  return new this.Bank(formData.name, formData.id);
};
