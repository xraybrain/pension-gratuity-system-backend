/**
 * Miscellanous is a combination of Allowance and Deductions
 */
const router = require('express').Router();
const {
  saveMiscellanous,
  getMiscellanous,
  updateMiscellanous,
  deleteMiscellanous,
} = require('../controllers/miscellanous.controllers');

router.get('/miscellanous/', getMiscellanous);
router.post('/miscellanous/', saveMiscellanous);
router.put('/miscellanous/', updateMiscellanous);
router.delete('/miscellanous/', deleteMiscellanous);

module.exports = router;
