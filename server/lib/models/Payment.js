exports.Payment = class {
  constructor(title = null, status = null, type = null, id = null) {
    if (title) this.title = title;
    if (status) this.status = status;
    if (type) this.type = type;
    if (id) this.id = id;
  }
};

exports.createPayment = (formData = {}) => {
  return new this.Payment(
    formData.title,
    formData.status,
    formData.type,
    formData.id
  );
};
