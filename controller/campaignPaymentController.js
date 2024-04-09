const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const CampaignPayment = require('../models/CampaignPayment');
const User = require('../models/User');
const Campaign = require('../models/CampaignUpload');

const campaignFee = 'price_1OhSf8FVGuxznuspYSChPHNW';

const createStripSession = async () => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: campaignFee,
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/api/checkout/success',
      cancel_url: 'http://localhost:3000/api/checkout/cancel',
    });
    return session;
  } catch (error) {
    console.log('Error creating Stripe Checkout Session', error);
    throw new Error('Failed to create Stripe session');
  }
};

const initiateCampaignPayment = async (req, res) => {
  const { campaignFee, userId, campaignId } = req.body;

  try {
    const session = await createStripSession(campaignFee);

    const campaignPayment = new CampaignPayment({
      user: userId,
      campaign: campaignId,
      sessionId: session.id,
    });
    await campaignPayment.save();

    return res.status(200).json({
      status: true,
      message: 'Payment initiation successful',
      data: { sessionUrl: session.url, sessionId: session.id },
    });
  } catch (error) {
    console.error('Error initiating campaign payment', error);
    return res.status(500).json({
      status: false,
      message: 'Error initiating campaign payment',
      data: null,
    });
  }
};

const paymentSuccess = async (req, res) => {
  const { sessionId, campaignId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === 'paid') {
      const savedCampaignPayment = await CampaignPayment.findOneAndUpdate(
        {
          campaign: campaignId,
        },
        {
          paymentStatus: 'Paid',
          paymentDate: Date.now(),
        },
        { returnDocument: 'after' }
      );

      await Campaign.findByIdAndUpdate(campaignId, {
        isPaidFor: true,
      });
      res.status(200).json({
        status: true,
        message: 'Payment Successful',
        data: savedCampaignPayment,
      });
    } else {
      console.error('Payment Failed - Not Paid');
      return res.status(400).json({
        status: true,
        message: 'Error Processing payment',
        data: null,
      });
    }
  } catch (error) {
    console.error('Error retrieving session', error);
    return res.status(400).json({
      status: true,
      message: 'Error Processing payment',
      data: null,
    });
  }
};

const webhookHandler = async (req, res) => {
  const payload = req.body;
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log(`This is a successful stripe event : ${event}`);
  } catch (error) {
    console.log(`This is a failed stripe event error : ${error}`);
  }

  res.status(200).json({ message: 'Event recieved successfully' });
};

module.exports = {
  initiateCampaignPayment,
  paymentSuccess,
  webhookHandler,
};
