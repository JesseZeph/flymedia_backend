const express = require('express');
const CampaignPaymentController = require('../controller/campaignPaymentController');
const router = express.Router();
const bodyParser = require('body-parser');

router.post(
  '/initiate-payment',
  CampaignPaymentController.initiateCampaignPayment
);
router.post('/payment-success', CampaignPaymentController.paymentSuccess);
router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  CampaignPaymentController.webhookHandler
);

module.exports = router;
