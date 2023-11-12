const express = require('express');
const router = express.Router();
const influencerApplicationController = require('../controller/influencerApplicationController');
const {verifyInfluencer } = require('../middleware/verifyToken')

router.post('/', verifyInfluencer, influencerApplicationController.applyForCampaign);
router.get('/:campaignId/applications', verifyInfluencer, influencerApplicationController.getInfluencerApplications);

module.exports = router;
