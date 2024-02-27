const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const InfluencerVerificationSchema = new Schema(
  {
    influencer: {
      type: mongoose.Types.ObjectId,
      ref: 'InfluencerProfile',
    },
    scanUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const InfluencerVerificationModel = mongoose.model(
  'InfluencerVerification',
  InfluencerVerificationSchema
);

module.exports = InfluencerVerificationModel;
