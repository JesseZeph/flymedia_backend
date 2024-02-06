const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    planId: String,
    planType: String,
    planStartDate: Date,
    planEndDate: Date,
    planDuration: Number,
    sessionId: String,
    createdAt: { type: Date, default: Date.now },

},{timestamps: true});

module.exports = mongoose.model('Payment', PaymentSchema);
