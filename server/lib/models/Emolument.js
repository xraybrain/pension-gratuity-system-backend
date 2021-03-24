exports.Emolument = class {
  constructor(
    prId = null,
    bankId = null,
    paymentId = null,
    status = null,
    consolidated = null,
    grossPay = null,
    totalDeducted = null,
    netPay = null,
    id = null
  ) {
    if (prId) this.prId = prId;
    if (bankId) this.bankId = bankId;
    if (paymentId) this.paymentId = paymentId;
    if (status) this.status = status;
    if (consolidated) this.consolidated = consolidated;
    if (grossPay) this.grossPay = grossPay;
    if (totalDeducted) this.totalDeducted = totalDeducted;
    if (netPay) this.netPay = netPay;
    if (id) this.id = id;
  }
};

exports.createEmolument = (formData = {}) => {
  return new this.Emolument(
    formData.prId,
    formData.bankId,
    formData.paymentId,
    formData.status,
    formData.consolidated,
    formData.grossPay,
    formData.totalDeducted,
    formData.netPay,
    formData.id
  );
};
