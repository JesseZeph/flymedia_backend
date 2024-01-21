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
  description: {
    type: String,
    required: true,
  },
  features: {
    type: String,
    required: true,
  },
  color_code: {
    type: String,
    required: false,
    default: 'ffffff',
  },
});

const SubscriptionModel = mongoose.model('Subscription', SubscriptionSchema);

module.exports = SubscriptionModel;
