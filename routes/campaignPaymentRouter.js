const express = require('express');
const CampaignPaymentController = require('../controller/campaignPaymentController');
const router = express.Router();

router.post(
  '/initiate-payment',
  CampaignPaymentController.initiateCampaignPayment
);
router.post('/payment-success', CampaignPaymentController.paymentSuccess);
router.post('/webhook', CampaignPaymentController.webhookHandler);

module.exports = router;
