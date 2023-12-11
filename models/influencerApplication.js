const mongoose = require('mongoose');

const InfluencerApplicationSchema = new mongoose.Schema({
    influencer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InfluencerProfile',
    },
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CampaignUpload',
    },
}, {timestamps: true},);

module.exports = mongoose.model('InfluencerApplication', InfluencerApplicationSchema);
