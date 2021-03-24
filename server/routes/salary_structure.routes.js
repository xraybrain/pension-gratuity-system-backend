const router = require('express').Router();

const {
  getSalaryStructures,
  saveSalaryStructure,
  updateSalaryStructure,
  deleteSalaryStructure,
  saveSalaryStructureList,
} = require('../controllers/salary_structure.controllers');

const uploader = require('../services/formidable')({ uploadDir: '/../temp/' });

router.get('/salary/structures', getSalaryStructures);
router.post('/salary/structures', uploader, saveSalaryStructure);
router.put('/salary/structures', updateSalaryStructure);
router.delete('/salary/structures', deleteSalaryStructure);
router.post('/salary/structures/lists', uploader, saveSalaryStructureList);

module.exports = router;
