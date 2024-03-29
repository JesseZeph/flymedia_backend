const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/Payment');
const User = require('../models/User');
const moment = require('moment');
const SubscriptionModel = require('../models/Subscription');
const Company = require('../models/VerifyCompany');

async function subscribeCompany(subscriptionPlan, userId) {
  try {
    const plan = await SubscriptionModel.findOne({
      name: subscriptionPlan.name,
    });
    await Company.findOneAndUpdate(
      { userId: userId },
      {
        subscription: plan.id,
        expiry: subscriptionPlan.expiryDate,
        campaignsInMonth: plan.campaigns_number,
      },
      {
        returnDocument: 'after',
      }
    );
  } catch (error) {
    console.log({ error });
  }
}
const createStripSession = async (plan) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan,
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

const paymentCheckout = async (req, res) => {
  //   const { plan, userId } = req.body;
  const { plan } = req.body;

  try {
    const session = await createStripSession(plan);
    // const user = await User.findOne({ _id: userId });

    // if (!user) {
    //     return res.status(404).json({ error: 'User not found' });
    // }

    // const payment = new Payment({
    //     user: user._id,
    //     sessionId: session.id,
    // });
    // await payment.save();
    return res.status(200).json({
      status: true,
      message: 'Processing payment',
      data: { redirectUrl: session.url, sessionId: session.id },
    });
  } catch (error) {
    console.error({ error });
    return res.status(500).json({
      status: false,
      message: 'Error with processing payment',
      data: null,
    });
  }
};

const paymentSuccess = async (req, res) => {
  const { sessionId, userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === 'paid') {
      const subscriptionId = session.subscription;

      //   try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      //   const user = await User.findOne({ _id: userId });

      //   user.sessionId = sessionId;
      //   await user.save();
      const planId = subscription.plan.id;
      let planType = '';

      if (subscription.plan.amount === 9900) planType = 'Basic Tier';
      else if (subscription.plan.amount === 29900) planType = 'Pro Tier';
      else if (subscription.plan.amount === 49900) planType = 'Premium Tier';

      const startDate = moment
        .unix(subscription.current_period_start)
        .format('YYYY-MM-DD');
      const endDate = moment
        .unix(subscription.current_period_end)
        .format('YYYY-MM-DD');
      const durationInSeconds =
        subscription.current_period_end - subscription.current_period_start;
      const durationInDays = moment
        .duration(durationInSeconds, 'seconds')
        .asDays();

      const newPayment = new Payment({
        user: userId,
        planId: planId,
        sessionId: session.id,
        planType: planType,
        planStartDate: startDate,
        planEndDate: endDate,
        planDuration: durationInDays,
      });

      const paymentMade = await newPayment.save();
      subscribeCompany(
        {
          name: planType,
          expiryDate: endDate,
        },
        userId
      );

      //   if (user.userType === 'Client') {
      //     user.payment.push(paymentMade._id);
      //     await user.save();
      //   }

      return res.status(200).json({
        status: true,
        message: 'Payment Successful',
        data: paymentMade,
      });
      //   }
      //   catch (error) {
      //     console.error('Error getting subscription', error);
      //     return res.status(500).json({
      //       status: false,
      //       message: 'Error processing subscription',
      //       data: null,
      //     });
      //   }
    } else {
      console.error('Payment failed - not paid');
      return res.status(500).json({
        status: false,
        message: 'Payment failed',
        data: null,
      });
    }
  } catch (error) {
    console.error('Error validating payment', error);
    return res.status(500).json({
      status: false,
      message: 'Error processing subscription',
      data: null,
    });
  }
};

const fetchPlans = async (req, res) => {
  try {
    const stripePrices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });

    // Filter out the "Campaign Payment" plan
    const subscriptionPlans = stripePrices.data
      .filter(
        (price) => price.product && price.product.name !== 'Campaign Payment'
      )
      .map((price) => ({
        id: price.id,
        name: price.product.name,
        price: price.unit_amount / 100,
      }));

    return res.status(200).json({
      status: true,
      message: 'Subscription plans fetched successfully',
      data: { plans: subscriptionPlans },
    });
  } catch (error) {
    console.error('Error fetching plans from Stripe', error);
    return res.status(500).json({
      status: false,
      message: 'Error fetching plans from Stripe',
      data: null,
    });
  }
};

module.exports = {
  paymentCheckout,
  paymentSuccess,
  fetchPlans,
};
