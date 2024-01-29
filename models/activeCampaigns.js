const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActiveCampaignSchema = new Schema({
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'CampaignDetails',
    required: true,
  },
  influencer: {
    type: Schema.Types.ObjectId,
    ref: 'InfluencerProfile',
    required: true,
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    default: 'In progress',
  },
  message: {
    type: String,
    default: 'The listing has not been completed.',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  verified_complete: {
    type: Boolean,
    default: false,
  },
  completed_date: {
    type: Date,
    default: null,
  },
});

const ActiveCampaignModel = mongoose.model(
  'ActiveCampaigns',
  ActiveCampaignSchema
);

module.exports = ActiveCampaignModel;
