const mongoose = require('mongoose');

const InfluencerApplicationSchema = new mongoose.Schema({
    influencer: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InfluencerProfile',
        },
        name: String,
        followerCount: String,
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
