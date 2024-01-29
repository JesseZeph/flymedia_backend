const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InfluencerAccountSchema = new Schema({
  influencer: {
    type: Schema.Types.ObjectId,
    ref: 'InfluencerProfile',
    required: true,
  },
  account_name: String,
  account_number: String,
  bank_name: String,
});

const InfluencerAccountModel = mongoose.model(
  'InfluencerAccount',
  InfluencerAccountSchema
);

module.exports = InfluencerAccountModel;
