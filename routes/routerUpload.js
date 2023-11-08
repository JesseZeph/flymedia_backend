const router = require('express').Router();
const UploadImageController = require('../controller/imageUploadController')
const {verifyAndAuthorization } = require('../middleware/verifyToken')
const upload = require('../middleware/multer');

router.post('/upload', verifyAndAuthorization, upload.single('image'),UploadImageController.imageUpload )
router.get('/upload/:id', verifyAndAuthorization, UploadImageController.getImageDetails )
router.get('/upload/', verifyAndAuthorization, UploadImageController.getAllImageDetails )

module.exports = router;

