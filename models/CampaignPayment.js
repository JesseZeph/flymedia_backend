const mongoose = require('mongoose');

const CampaignPaymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    campaign: {
        type: mongoose.Types.ObjectId,
        ref: 'CampaignDetails',
        required: false,
    },
    sessionId: String,
    paymentStatus: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Paid'],
    },
    paymentDate: {
        type: Date,
    },
},);

module.exports = mongoose.model('CampaignPayment', CampaignPaymentSchema);
