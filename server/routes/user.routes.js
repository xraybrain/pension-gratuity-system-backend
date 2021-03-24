const router = require('express').Router();
const {
  getUsers,
  saveUser,
  updateUser,
  deleteUser,
  changeUserPassport,
  userDashboard,
} = require('../controllers/user.controller');
const uploadAndSubmit = require('../services/formidable')({
  uploadDir: '../../client/src/assets/uploads',
  canSkipUpload: true,
});

const uploadPassport = require('../services/formidable')({
  uploadDir: '../../client/src/assets/uploads',
  canSkipUpload: false,
});

router.get('/users/', getUsers);
router.post('/users/', uploadAndSubmit, saveUser);
router.post('/users/change/passport', uploadPassport, changeUserPassport);
router.put('/users/', updateUser);
router.delete('/users/', deleteUser);
router.get('/users/dashboard', userDashboard);
module.exports = router;
