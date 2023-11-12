const router = require('express').Router();
const publishCampaignController = require('../controller/publishCampaignController');
const {verifyAndAuthorization} = require('../middleware/verifyToken')


router.post('/:companyId/:jobSpecId', verifyAndAuthorization, publishCampaignController.publishCampaignAndJobSpecs );

module.exports = router;