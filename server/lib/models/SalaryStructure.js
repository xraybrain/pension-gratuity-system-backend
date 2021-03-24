exports.SalaryStructure = class {
  constructor(name = null, shortName = null, id = null) {
    if (name) this.name = name;
    if (shortName) this.shortName = shortName;
    if (id) this.id = id;
  }
};

exports.createSalaryStructure = (formData = {}) => {
  return new this.SalaryStructure(
    formData.name,
    formData.shortName,
    formData.id
  );
};
