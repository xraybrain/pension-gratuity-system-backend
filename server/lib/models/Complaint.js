exports.Complaint = class {
  constructor(content, status, readStatus, prId, id) {
    if (content) this.content = content;
    if (status) this.status = status;
    if (readStatus) this.readStatus = readStatus;
    if (prId) this.prId = prId;
    if (id) this.id = id;
  }
};

exports.createComplaint = (formData = {}, pensioneerId) => {
  return new this.Complaint(
    formData.content,
    formData.status,
    formData.readStatus,
    pensioneerId || formData.prId,
    formData.id
  );
};

exports.ComplaintReadStatus = {
  UnRead: 0,
  Read: 1,
};
