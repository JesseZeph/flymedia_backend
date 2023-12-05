const router = require('express').Router();
const UploadImageController = require('../controller/campaignUploadController')
const {verifyAndAuthorization } = require('../middleware/verifyToken')
const upload = require('../middleware/multer');

router.post('/', verifyAndAuthorization, upload.single('image'),UploadImageController.uploadCampaignImageAndDesc )
router.get('/:id', verifyAndAuthorization, UploadImageController.getCampaignImageAndDesc )
router.get('/', UploadImageController.getAllCampaignImageAndDesc )

module.exports = router;

