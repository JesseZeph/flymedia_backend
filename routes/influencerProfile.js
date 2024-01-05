const router = require('express').Router();
const InfluencerProfileController = require('../controller/influencerProfileController');
const { verifyInfluencer } = require('../middleware/verifyToken');
const upload = require('../middleware/multer');

router.post(
  '/:id',
  verifyInfluencer,
  upload.single('influencerImage'),
  InfluencerProfileController.uploadProfilePhoto
);
router.get('/:id', InfluencerProfileController.getInfluencerProfile);
router.get('/', InfluencerProfileController.allInfluencers);
router.get(
  '/clientside/:id',
  InfluencerProfileController.getInfluencerProfileClientSide
);

router.put(
  '/:id',
  verifyInfluencer,
  upload.single('influencerImage'),
  InfluencerProfileController.updateInfluencerProfile
);

module.exports = router;
