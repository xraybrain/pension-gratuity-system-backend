const router = require('express').Router();
const {
  saveLogin,
  updateLogin,
  getEmail,
} = require('../controllers/login.controllers');

router.post('/logins/', saveLogin);
router.put('/logins/', updateLogin);
router.get('/login/:email', getEmail);

module.exports = router;
