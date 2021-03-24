const router = require('express').Router();
const {
  getPensioneers,
  savePensioneer,
  updatePensioneer,
  deletePensioneer,
  savePensioneersUpload,
  changePassport,
  getPensioneer,
} = require('../controllers/pensioneer.controllers');
const uploadAndSubmit = require('../services/formidable')({
  uploadDir: '../../client/src/assets/uploads',
  canSkipUpload: true,
});
const uploader = require('../services/formidable')({
  uploadDir: '../../client/src/assets/uploads',
  canSkipUpload: false,
});
const pensioneerUploader = require('../services/formidable')({
  uploadDir: '../temp',
});

router.get('/pensioneers/', getPensioneers);
router.get('/pensioneer/', getPensioneer);
router.post('/pensioneers/', uploadAndSubmit, savePensioneer);
router.post('/pensioneers/change/passport', uploader, changePassport);
// router.post('/pensioneers/', savePensioneer); //TODO: remove after testing
router.post('/pensioneers/upload/', pensioneerUploader, savePensioneersUpload);
router.put('/pensioneers/', updatePensioneer);
router.delete('/pensioneers/', deletePensioneer);

module.exports = router;
