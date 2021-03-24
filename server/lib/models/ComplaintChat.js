exports.ComplaintChat = class {
  constructor(reply, complaintId, loginId, id) {
    if (reply) this.reply = reply;
    if (complaintId) this.complaintId = complaintId;
    if (loginId) this.loginId = loginId;
    if (id) this.id = id;
  }
};

exports.createComplaintChat = (formData = {}, loginId) => {
  return new this.ComplaintChat(
    formData.reply,
    formData.complaintId,
    loginId || formData.loginId,
    formData.id
  );
};
