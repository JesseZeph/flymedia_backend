const express = require('express');
const router = express.Router();
const influencerApplicationController = require('../controller/influencerApplicationController');
const { verifyInfluencer, verifyClient } = require('../middleware/verifyToken');

router.post(
  '/apply',
  verifyInfluencer,
  influencerApplicationController.applyForCampaign
);
router.get(
  '/influencer',
  influencerApplicationController.getInfluencerApplications
);

router.get('/campaign', influencerApplicationController.getCampaignApplicants);

module.exports = router;
