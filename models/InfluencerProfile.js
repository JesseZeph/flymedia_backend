const mongoose = require('mongoose');

const InfluencerProfileSchema = new mongoose.Schema({
  imageURL: {
    type: String,
    required: true,
  },
  firstAndLastName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  tikTokLink: {
    type: String,
    required: true,
  },
  noOfTikTokFollowers: {
    type: String,
    required: true,
  },
  noOfTikTokLikes: {
    type: String,
    required: true,
  },
  postsViews: {
    type: String,
    required: true,
    enum: [
      '10k - 50k',
      '50k - 200k',
      '200k - 500k',
      '500k - 1m',
      '1m and above',
    ],
  },

  niches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Niche',
    },
  ],

  bio: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    // unique: true,
  },
});

module.exports = mongoose.model('InfluencerProfile', InfluencerProfileSchema);
