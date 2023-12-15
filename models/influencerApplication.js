const mongoose = require('mongoose');

const InfluencerApplicationSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CampaignDetails',
      unique: false,
    },
    influencers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InfluencerProfile',
        unique: false,
        default: [],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'InfluencerApplication',
  InfluencerApplicationSchema
);
