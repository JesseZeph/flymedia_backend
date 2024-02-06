const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/Payment');
const User = require('../models/User');


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
            success_url: 'api/checkout/success',
            cancel_url: 'api/checkout/cancel'
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
        const clientPayment = await payment.save();
        return res.status(200).json({
            status: true,
            message: 'Payment successful',
            data: clientPayment,
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

module.exports = {
    paymentCheckout
}