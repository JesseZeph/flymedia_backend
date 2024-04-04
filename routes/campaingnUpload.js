const router = require('express').Router();
const UploadCampaign = require('../controller/campaignUploadController');
const AssignedCampaignController = require('../controller/assignedCampaignController');
const {
  verifyAndAuthorization,
  verifyClient,
  verifyInfluencer,
} = require('../middleware/verifyToken');

router.post('/assign', verifyClient, UploadCampaign.assignInfluencer);
router.post('/accept', verifyInfluencer, UploadCampaign.acceptCampaign);
router.post(
  '/',
  verifyAndAuthorization,  UploadCampaign.uploadCampaignImageAndDesc
);

// router.get('/:id', UploadCampaign.getCampaignImageAndDesc);
router.delete(
  '/delete/:id',
  verifyAndAuthorization,
  UploadCampaign.deleteCampaign
);
router.get('/campaigns',  UploadCampaign.getAllCampaignImageAndDesc);
router.put('/edit/:id', verifyClient, UploadCampaign.editCampaign);

router.get('/search/:key', UploadCampaign.searchCampaign);
router.get(
  '/client',
  verifyAndAuthorization,
  UploadCampaign.clientSpecificCampaign
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
