const express = require('express');
const router = express.Router();
const influencerApplicationController = require('../controller/influencerApplicationController');
const {verifyInfluencer, verifyClient } = require('../middleware/verifyToken')

router.post('/', verifyInfluencer, influencerApplicationController.applyForCampaign);
router.get('/applications/:id', influencerApplicationController.getInfluencerApplications);


module.exports = router;
