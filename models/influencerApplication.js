const mongoose = require('mongoose');

const InfluencerApplicationSchema = new mongoose.Schema(
  {
    influencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InfluencerProfile',
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CampaignDetails',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'InfluencerApplication',
  InfluencerApplicationSchema
);
