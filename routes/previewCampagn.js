const router = require('express').Router();
const previewCampaignController = require('../controller/previewCampaignController');
const {verifyAndAuthorization} = require('../middleware/verifyToken')


router.get('/:companyId/:jobSpecId', verifyAndAuthorization, previewCampaignController.previewCampaignAndJobSpecs);

module.exports = router;