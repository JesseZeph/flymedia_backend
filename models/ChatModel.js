const mongoose = require('mongoose');

const schema = mongoose.Schema;

const ChatSchema = new schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    influencer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InfluencerProfile',
    },
    last_message: {
      type: String,
    },
    firstore_doc: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

const ChatModel = mongoose.model('Chat', ChatSchema);

module.exports = ChatModel;
