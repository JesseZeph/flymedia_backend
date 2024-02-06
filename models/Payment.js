const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    sessionId: String,
    createdAt: { type: Date, default: Date.now },

},{timestamps: true});

module.exports = mongoose.model('Payment', PaymentSchema);
