const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/Payment');
const User = require('../models/User');
const moment = require('moment');



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
        });
        return session;
    } catch (error) {
        console.log("Error creating Stripe Checkout Session", error);
        throw new Error('Failed to create Stripe session');
    }
}

const paymentCheckout = async (req, res) => {
    const { plan, userId } = req.body;

    try {
        const session = await createStripSession(plan);
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const payment = new Payment({
            user: user._id,
            sessionId: session.id,
        });
        await payment.save();
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

                const newPayment = new Payment({
                    user: user._id,
                    planId: planId,
                    sessionId: session.id,
                    planType: planType,
                    planStartDate: startDate,
                    planEndDate: endDate,
                    planDuration: durationInDays
                });

                const paymentMade = await newPayment.save();

                if (user.userType === 'Client') {
                    user.payment.push(paymentMade._id);
                    await user.save();
                }

                return res.status(200).json({
                    status: true,
                    message: "Payment Successful",
                    data: paymentMade,
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

// paymentController.js

const fetchPlans = async (req, res) => {
    try {
        const stripePrices = await stripe.prices.list({ active: true, expand: ['data.product'] });

        const subscriptionPlans = stripePrices.data
            .filter(price => price.product && price.product.name !== "Campaign Payment")
            .map((price) => ({
                id: price.id,
                name: price.product.name,
                price: price.unit_amount / 100,
            }));

        // Update SubscriptionModel with the fetched plans
        for (const plan of subscriptionPlans) {
            await SubscriptionModel.findOneAndUpdate(
                { name: plan.name },
                { price: plan.price },
                { upsert: true }
            );
        }

        return res.status(200).json({
            status: true,
            message: 'Subscription plans fetched and updated successfully',
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
    fetchPlans
}