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
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
   
});

module.exports = mongoose.model('InfluencerApplication', InfluencerApplicationSchema);
