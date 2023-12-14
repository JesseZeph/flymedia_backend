const mongoose = require('mongoose');

const InfluencerApplicationSchema = new mongoose.Schema(
  {
    influencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InfluencerProfile',
      unique: false,
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CampaignDetails',
      unique: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'InfluencerApplication',
  InfluencerApplicationSchema
);
