const mongoose = require('mongoose');

const GroupChatSchema = new mongoose.Schema({
  influencer: {
    type: mongoose.Types.ObjectId,
    ref: 'InfluencerProfile',
  },
  client: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  admin: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  group_name: {
    type: String,
    required: true,
  },
  group_image: {
    type: String,
    required: true,
  },
  last_message: {
    type: String,
    default: '',
  },
  new_message_count: {
    type: Number,
    default: 0,
  },
  new_message_count_client: {
    type: Number,
    default: 0,
  },
  new_message_count_admin: {
    type: Number,
    default: 0,
  },
});

const GroupChatModel = mongoose.model('Groupchat', GroupChatSchema);

module.exports = GroupChatModel;
