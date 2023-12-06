const router = require('express').Router();
const publishCampaignController = require('../controller/publishCampaignController');
const {verifyAndAuthorization} = require('../middleware/verifyToken')


router.post('/:id', verifyAndAuthorization, publishCampaignController.publishCampaign );

module.exports = router;