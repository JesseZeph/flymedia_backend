const router = require('express').Router();
const userController = require('../controller/userController');
const {verifyAndAuthorization} = require('../middleware/verifyToken')


router.get('/user/:id', userController.getUser);
router.delete('/',userController.deleteUser);
router.put('/',userController.updateUser);
router.get('/totalUsers', userController.getTotalUsers);
router.get('/influencers', userController.getTotalInfluencers);

module.exports = router;