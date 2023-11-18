const router = require('express').Router();
const InfluencerProfileController = require('../controller/influencerProfileController')
const {verifyInfluencer } = require('../middleware/verifyToken')
const upload = require('../middleware/multer');

router.post('/:userId', verifyInfluencer, upload.single('influencerImage'),InfluencerProfileController.uploadProfilePhoto )
router.get('/:id', InfluencerProfileController.displayInfluencerProfile)
router.put('/:userId', verifyInfluencer, upload.single('influencerImage'), InfluencerProfileController.updateInfluencerProfile);

module.exports = router;