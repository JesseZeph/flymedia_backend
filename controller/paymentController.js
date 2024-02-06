const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/Payment');
const User = require('../models/User');
const moment = require('moment');


const [basic, pro, premium] = ['price_1Og4JxFVGuxznuspBXxtw1Jm', 'price_1Og4KtFVGuxznuspmVEFRuRm', 'price_1Og4MHFVGuxznuspRxJ8HnES']


const createStripSession = async (plan) => {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: plan,
                    quantity: 1
                },
            ],
            success_url: 'http://localhost:3000/api/checkout/success',
            cancel_url: 'http://localhost:3000/api/checkout/cancel'
        }); return session;

    } catch (error) {
        console.log("Error creating Stripe Checkout Session", error);
        throw new Error('Failed to create Stripe session');


    }

}

const paymentCheckout = async (req, res) => {
    const { plan, userId } = req.body;

    let planId = null;
    if (plan == 99) planId = basic;
    else if (plan == 299) planId = pro;
    else if (plan == 499) planId = premium;

    try {

        const session = await createStripSession(plan);
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        const payment = new Payment({
            user: user._id,
            sessionId: session.id,
        })
        console.log(session.id);
        await payment.save();
        return res.status(200).json({
            status: true,
            message: 'Processing payment',
            data: { redirectUrl: session.url },
        });
        
    } catch (error) {
        console.error({ error });
        return res.status(500).json({
            status: false,
            message: 'Error with processing payment',
            data: null,
        });

    }

}

const paymentSuccess = async (req, res) => {
    const { sessionId, userId } = req.body;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status === "paid") {
            const subscriptionId = session.subscription;

            try {
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const user = await User.findOne({ _id: userId });

                user.sessionId = sessionId;
                await user.save();

                const planId = subscription.plan.id;
                let planType = "";

                if (subscription.plan.amount === 9900) planType = 'basic';
                else if (subscription.plan.amount === 29900) planType = 'pro';
                else if (subscription.plan.amount === 49900) planType = 'premium';

                const startDate = moment.unix(subscription.current_period_start).format('YYYY-MM-DD');
                const endDate = moment.unix(subscription.current_period_end).format('YYYY-MM-DD')
                const durationInSeconds = subscription.current_period_end - subscription.current_period_start;
                const durationInDays = moment.duration(durationInSeconds, 'seconds').asDays();

                const newSubscription = new Payment({
                    user: user._id,
                    planId: planId,
                    sessionId: session.id,
                    planType: planType,
                    planStartDate: startDate,
                    planEndDate: endDate,
                    planDuration: durationInDays
                });

                const savedSubscription = await newSubscription.save();

                if (user.userType === 'Client') {
                    user.subscriptions.push(savedSubscription._id);
                    await user.save();
                }

                return res.status(200).json({
                    status: true,
                    message: "Payment Successful",
                    data: savedSubscription,
                });
            } catch (error) {
                console.error('Error getting subscription', error);
                return res.status(500).json({
                    status: false,
                    message: 'Error processing subscription',
                    data: null,
                });
            }
        } else {
            console.error('Payment failed - not paid');
            return res.status(500).json({
                status: false,
                message: 'Payment failed',
                data: null,
            });
        }
    } catch (error) {
        console.error('Error retrieving session', error);
        return res.status(500).json({
            status: false,
            message: 'Error processing subscription',
            data: null,
        });
    }
}

const handleWebhookEvent = async (payload) => {
    try {
      switch (payload.type) {
        case 'customer.subscription.created':
          console.log('Subscription created:', payload);
  
        //   const subscriptionId = payload.data.object.id;
  
        //   await updateUserSubscription(subscriptionId);
  
          break;
  
        case 'checkout.session.completed':
          console.log('Checkout session completed:', payload);
  
        //   const sessionId = payload.data.object.id;
  
        //   await updatePaymentStatus(sessionId, 'success');
  
          break;
  
        case 'invoice.payment_succeeded':
          console.log('Invoice payment succeeded:', payload);
  
        //   const invoiceId = payload.data.object.id;

        //   await updatePaymentStatus(invoiceId, 'success');
  
          break;
  
        case 'invoice.payment_failed':
          console.log('Invoice payment failed:', payload);
  
        //   const failedInvoiceId = payload.data.object.id;
        //   await updatePaymentStatus(failedInvoiceId, 'failed');
  
          break;
  
  
        default:
          console.log('Unhandled event type:', payload.type);
      }
    } catch (error) {
      console.error('Error handling webhook event:', error);
    }
  };


module.exports = {
    paymentCheckout,
    paymentSuccess,
    handleWebhookEvent
}