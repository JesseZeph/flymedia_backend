const mongoose = require('mongoose');

const schema = mongoose.Schema;

const SubscriptionSchema = new schema({
  price: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  applicants_number: { type: Number, default: 0 },
  campaigns_number: { type: Number, default: 0 },
  features: {
    type: String,
    required: true,
  },
  color_code: {
    type: String,
    required: false,
    default: 'ffffff',
  },
  description: {
    type: String,
    required: false,
  },
});

const SubscriptionModel = mongoose.model('Subscription', SubscriptionSchema);

module.exports = SubscriptionModel;
