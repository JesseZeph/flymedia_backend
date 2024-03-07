const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const InfluencerPointsSchema = new Schema({
  influencer: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'InfluencerProfile',
  },
  campaigns_completed: {
    type: Number,
    default: 0,
  },
  total_points: {
    type: Number,
    default: 4,
  },
  completed_tasks: {
    type: [String],
    default: ['0', '1'],
  },
});

const PointModel = mongoose.model('InfluencerPoint', InfluencerPointsSchema);

module.exports = PointModel;
