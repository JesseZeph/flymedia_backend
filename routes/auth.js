const router = require('express').Router();
const authController = require('../controller/authController');

router.post('/register', authController.createUser);
router.post('/register/influencer', authController.createInfluencer);
router.post('/register/admin', authController.createAdmin);
router.post('/register/superAdmin', authController.createSuperAdmin);
router.post('/login', authController.loginUser);
router.post('/influencer/login', authController.loginUser);

router.post('/forgotPassword', authController.forgotPassword);
router.post('/verifyPasswordReset', authController.verifyPasswordResetCode);

router.patch('/resetPassword', authController.changePassword);
router.patch('/verifyEmail', authController.verifyUserEmail);
router.post('/resendVerification', authController.resendVerificationCode);

module.exports = router;
