const mongoose = require('mongoose');

const InfluencerProfileSchema = new mongoose.Schema({
    imageURL: {
        type: String,
        required: true
    },
    firstAndLastName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    noOfTikTokFollowers: {
        type: String,
        required: true
    },
    noOfTikTokLikes: {
        type: String,
        required: true
    },
    postsViews: { type: String, required: true, enum: ['10,000 - 50,000', '50,000 - 200,000', '200,000 - 500,000', '500,000 - 1,000,000', '1,000,000 - 3,000,000'] },

    niches: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Niche',
        },
    ],

    bio: {
        type: String,
        required: true
    },
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    ratings: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            stars: { type: Number, required: true, min: 1, max: 5 },
        },
    ],


});

module.exports = mongoose.model('InfluencerProfile', InfluencerProfileSchema);
