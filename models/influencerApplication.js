const mongoose = require('mongoose');

const InfluencerApplicationSchema = new mongoose.Schema({
    influencerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InfluencerProfile',
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CampaignUpload',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

InfluencerApplicationSchema.index({ influencerId: 1, campaignId: 1 }, { unique: true });

module.exports = mongoose.model('InfluencerApplication', InfluencerApplicationSchema);
