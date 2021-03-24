const router = require('express').Router();
const {
  saveDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/department.controllers');
const {
  saveDesignation,
  updateDesignation,
  deleteDesignation,
  getDesignations,
} = require('../controllers/designation.controllers');

router.get('/departments/', getDepartments);
router.post('/departments/', saveDepartment);
router.put('/departments/', updateDepartment);
router.delete('/departments/', deleteDepartment);

router.get('/designations/', getDesignations);
router.post('/designations/', saveDesignation);
router.put('/designations/', updateDesignation);
router.delete('/designations/', deleteDesignation);

module.exports = router;
