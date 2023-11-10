const router = require('express').Router();
const authController = require('../controller/authController');


router.post('/register', authController.createUser);
router.post('/register/influencer', authController.createInfluencer);
router.post('/register/admin', authController.createAdmin);
router.post('/register/superAdmin', authController.createSuperAdmin);
router.post('/login', authController.loginUser);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);


module.exports = router;