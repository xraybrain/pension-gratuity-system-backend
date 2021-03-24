const {
  getComplaint,
  saveComplaint,
  updateComplaint,
  deleteComplaint,
  getComplaints,
  countUnreadComplaints,
  markComplaintsAsRead,
} = require('../controllers/complaint.controllers');
const {
  getComplaintChat,
  saveComplaintChat,
  updateComplaintChat,
  deleteComplaintChat,
} = require('../controllers/complaint_chats.controllers');

const router = require('express').Router();

router.get('/complaints/', getComplaints);
router.get('/complaint/:cid', getComplaint);
router.post('/complaints/', saveComplaint);
router.put('/complaints/', updateComplaint);
router.delete('/complaints/', deleteComplaint);
router.get('/complaints/unread/total/', countUnreadComplaints);
router.post('/complaints/mark/read/', markComplaintsAsRead);

router.get('/complaints/chats/', getComplaintChat);
router.post('/complaints/chats/', saveComplaintChat);
router.put('/complaints/chats/', updateComplaintChat);
router.delete('/complaints/chats/', deleteComplaintChat);

module.exports = router;
