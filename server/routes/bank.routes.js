const router = require('express').Router();
const {
  saveBank,
  getBanks,
  updateBank,
  deleteBank,
} = require('../controllers/bank.controllers');

router.get('/banks/', getBanks);
router.post('/banks/', saveBank);
router.put('/banks/', updateBank);
router.delete('/banks/', deleteBank);

module.exports = router;
