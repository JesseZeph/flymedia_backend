const mongoose = require('mongoose');

const InfluencerApplicationSchema = new mongoose.Schema({
    influencer: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InfluencerProfile',
            required: true,
        },
        name: String,
        followerCount: String,
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CampaignUpload',
        required: true,
    },
    jobSpecId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobSpecification',
        required: true,
    },
    // other fields as needed
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('InfluencerApplication', InfluencerApplicationSchema);
