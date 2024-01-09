const express = require('express');

const router = express.Router();
const controller = require('../controller/appleController');

router.post('/callbacks/sign_up_with_apple', controller.callback);

router.post('/sign_up_with_apple', controller.signUpApple);

module.exports = router;
