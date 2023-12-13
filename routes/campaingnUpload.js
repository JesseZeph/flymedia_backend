const router = require('express').Router();
const UploadImageController = require('../controller/campaignUploadController');
const { verifyAndAuthorization } = require('../middleware/verifyToken');
const upload = require('../middleware/multer');

router.post(
  '/',
  verifyAndAuthorization,
  upload.single('image'),
  UploadImageController.uploadCampaignImageAndDesc
);

// router.get('/:id', UploadImageController.getCampaignImageAndDesc);
router.delete(
  '/delete/:id',
  verifyAndAuthorization,
  UploadImageController.deleteCampaign
);
router.get('/campaigns', UploadImageController.getAllCampaignImageAndDesc);
router.get('/search/:key', UploadImageController.searchCampaign);
router.get(
  '/client',
  verifyAndAuthorization,
  UploadImageController.clientSpecificCampaign
);

module.exports = router;
