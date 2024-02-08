
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

const initiateCampaignPayment = async (req, res) => {
    const { campaignFee, userId, campaignId } = req.body;

    try {
        const session = await createStripSession(campaignFee)

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found',
                data: null,
            });
        }


        const campaignPayment = new CampaignPayment({
            user: user._id,
            campaign: campaignId,
            paymentStatus: 'Pending',
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
    const { sessionId, campaignId, userId } = req.body;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        if (session.payment_status === 'paid') {
            try {
                const campaign = await Campaign.find({ _id: campaignId })
                const user = await User.findOne({ _id: userId });


                campaign.sessionId = sessionId;
                const newCampaignPayment = new CampaignPayment({
                    user: user._id,
                    campaign: campaignId,
                    sessionId: session.id,
                    paymentStatus: 'Paid',
                    paymentDate: Date.now()
                });

                const savedCampaignPayment = await newCampaignPayment.save();
                res.status(200).json({
                    status: true,
                    message: 'Payment Successful',
                    data: savedCampaignPayment
                })

            } catch (error) {
                console.error('Error getting Payment from Stripe: ', error);
                res.status(400).json({
                    status: false,
                    message: 'Error Processing payment',
                    data: null
                })
            }
        } else {
            console.error('Payment Failed - Not Paid');
            return res.status(400).json({
                status: true,
                message: 'Error Processing payment',
                data: null
            })
        }
    } catch (error) {
        console.error('Error retrieving session', error);
        return res.status(400).json({
            status: true,
            message: 'Error Processing payment',
            data: null
        })
    }
}


module.exports = {
    initiateCampaignPayment,
    paymentSuccess
};