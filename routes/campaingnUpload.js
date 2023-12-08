const router = require('express').Router();
const UploadImageController = require('../controller/campaignUploadController')
const {verifyAndAuthorization } = require('../middleware/verifyToken')
const upload = require('../middleware/multer');

router.post('/', verifyAndAuthorization, upload.single('image'),UploadImageController.uploadCampaignImageAndDesc )
router.get('/:id', UploadImageController.getCampaignImageAndDesc )
router.get('/', UploadImageController.getAllCampaignImageAndDesc )
router.get('/search/:key', UploadImageController.searchCampaign);
router.get('/:id', UploadImageController.getUserCampaigns)


module.exports = router;

