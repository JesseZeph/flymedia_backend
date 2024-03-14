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
    new_messages_count: {
      type: Number,
      default: 1,
    },
    new_messages_count_client: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// ChatSchema.post('findOneAndUpdate', function (doc, next) {
//   doc.new_messages_count++;
//   doc.save();
//   next();
// });

const ChatModel = mongoose.model('Chat', ChatSchema);

module.exports = ChatModel;
