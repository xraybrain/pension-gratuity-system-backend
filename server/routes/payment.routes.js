const router = require('express').Router();

const {
  getPayments,
  getPayment,
  savePayment,
  updatePayment,
  deletePayment,
} = require('../controllers/payment.controllers');

const {
  getEmoluments,
  calculateEmolument: calculatePayment,
  updateEmolument,
  deleteEmolument,
  emolumentSummary,
} = require('../controllers/emolument.controller');

router.get('/payments/', getPayments);
router.get('/payment/:id', getPayment);
router.post('/payments/', savePayment);
router.put('/payments/', updatePayment);
router.delete('/payments/', deletePayment);

router.get('/payments/emoluments/', getEmoluments);
router.post('/payments/emoluments/', calculatePayment);
router.put('/payments/emoluments/', updateEmolument);
router.delete('/payments/emoluments/', deleteEmolument);
router.get('/payments/emoluments/summary', emolumentSummary);
module.exports = router;
