const router = require('express').Router();
const authController = require('../controller/authController');


router.post('/register', authController.createUser);
router.post('/login', authController.loginUser);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);


module.exports = router;