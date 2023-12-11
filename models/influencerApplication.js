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
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // ratings: [
    //     {
    //         userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    //         stars: { type: Number, required: true, min: 1, max: 5 },
    //     },
    // ],
});

module.exports = mongoose.model('InfluencerApplication', InfluencerApplicationSchema);
