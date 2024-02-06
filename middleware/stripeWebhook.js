const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const verifyWebhookSignature = async (req, res, next) => {
    const sigHeader = req.headers['stripe-signature'];
    try {
      const event = stripe.webhooks.constructEvent(req.rawBody, sigHeader, process.env.STRIPE_WEBHOOK_SECRET);
      req.event = event;
      next();
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send('Webhook signature verification failed');
    }
  };

  module.exports = verifyWebhookSignature;