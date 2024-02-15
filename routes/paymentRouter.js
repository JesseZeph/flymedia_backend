const express = require('express');
const PaymentController = require('../controller/paymentController');
const router = express.Router();

router.post('/subscription-checkout', PaymentController.paymentCheckout);
router.post('/payment-success', PaymentController.paymentSuccess);
router.get('/all-plans', PaymentController.fetchPlans),



module.exports = router;