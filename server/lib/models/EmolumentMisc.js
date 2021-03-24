const { isDigit } = require('../Validator');

exports.EmolumentMisc = class {
  constructor(
    mixedId = null,
    miscId = null,
    paymentId = null,
    emId = null,
    subTotalAmount = null,
    id = null
  ) {
    if (mixedId) this.mixedId = mixedId;
    if (miscId) this.miscId = miscId;
    if (emId) this.emId = emId;
    if (paymentId) this.paymentId = paymentId;
    if (isDigit(subTotalAmount)) this.subTotalAmount = subTotalAmount;
    if (id) this.id = id;
  }
};

exports.createEmolumentMisc = (formData = {}) => {
  return new this.EmolumentMisc(
    formData.mixedId,
    formData.miscId,
    formData.paymentId,
    formData.emId,
    formData.subTotalAmount,
    formData.id
  );
};
