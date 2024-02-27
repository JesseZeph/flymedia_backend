const router = require('express').Router();
const InfluencerProfileController = require('../controller/influencerProfileController');
const { verifyInfluencer, verifyAdmin } = require('../middleware/verifyToken');
const upload = require('../middleware/multer');

router.post(
  '/verification',
  verifyInfluencer,
  upload.single('scan_image'),
  InfluencerProfileController.uploadVerification
);

router.post(
  '/:id',
  verifyInfluencer,
  upload.single('influencerImage'),
  InfluencerProfileController.uploadProfilePhoto
);
router.get(
  '/verification',
  verifyAdmin,
  InfluencerProfileController.fetchPendingVerifications
);
router.get('/:id', InfluencerProfileController.getInfluencerProfile);
router.get('/', InfluencerProfileController.allInfluencers);
router.get(
  '/clientside/:id',
  InfluencerProfileController.getInfluencerProfileClientSide
);

router.put(
  '/verification',
  verifyAdmin,
  InfluencerProfileController.verifyInfluencer
);
router.put(
  '/:id',
  verifyInfluencer,
  upload.single('influencerImage'),
  InfluencerProfileController.updateInfluencerProfile
);

module.exports = router;
