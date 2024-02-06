const express = require('express');
const PaymentController = require('../controller/paymentController');
const router = express.Router();

router.post('/subscription-checkout', PaymentController.paymentCheckout);

module.exports = router;