const router = require('express').Router();
const UploadImageController = require('../controller/campaignUploadController');
const AssignedCampaignController = require('../controller/assignedCampaignController');
const {
  verifyAndAuthorization,
  verifyClient,
} = require('../middleware/verifyToken');
const upload = require('../middleware/multer');

router.post('/assign', verifyClient, UploadImageController.assignInfluencer);
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
router.get(
  '/assign/:id',
  verifyAndAuthorization,
  AssignedCampaignController.fetchUserCampaigns
);

router.put(
  '/assign',
  verifyAndAuthorization,
  AssignedCampaignController.campaignAction
);

module.exports = router;
