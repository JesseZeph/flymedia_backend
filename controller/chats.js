const Chat = require('../models/ChatModel');

const addChat = async (req, res) => {
  const { company_owner_id, influencer_id, last_message, user_type } = req.body;

  try {
    const newChat = new Chat({
      company: company_owner_id,
      influencer: influencer_id,
      last_message: last_message,
    });
    // if (user_type == 'Client') {
    //   newChat.new_messages_count = 1;
    // } else {
    //   newChat.new_messages_count_client = 1;
    // }
    await newChat.save();

    res
      .status(200)
      .json({ status: true, message: 'New chat created', data: newChat });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: 'Error creating new chat', data: null });
  }
};

const updateChat = async (req, res) => {
  const { chat_id, last_message, user_type } = req.body;

  try {
    const chat = await Chat.findById(chat_id);
    chat.last_message = last_message;
    if (user_type == 'Client') {
      chat.new_messages_count += 1;
    } else {
      chat.new_messages_count_client += 1;
    }
    const updatedChat = await chat.save();
    // const chat = await Chat.findByIdAndUpdate(
    //   chat_id,
    //   { last_message: last_message },
    //   {
    //     new: true,
    //     returnDocument: 'after',
    //   }
    // ).exec();
    // if (chat) {
    res.status(200).json({
      status: true,
      message: 'Chat updated successfully',
      data: updatedChat,
    });
    // } else {
    //   res.status(404).json({
    //     success: false,
    //     message: 'Chat not found',
    //     data: null,
    //   });
    // }
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: 'Error updating chat', data: null });
  }
};

const deleteChat = async (req, res) => {
  const { chat_id, user_type } = req.body;
  let chatResponse;
  try {
    const chat = await Chat.findById(chat_id);
    switch (user_type) {
      case 'Client':
        if (chat.influencer_deleted) {
          chatResponse = await Chat.findByIdAndDelete(chat_id);
        } else {
          chatResponse = await Chat.findByIdAndUpdate(chat_id, {
            client_deleted: true,
          });
        }
        break;
      case 'Influencer':
        if (chat.client_deleted) {
          chatResponse = await Chat.findByIdAndDelete(chat_id);
        } else {
          chatResponse = await Chat.findByIdAndUpdate(chat_id, {
            influencer_deleted: true,
          });
        }
        break;
    }
    // const deletedDoc = await Chat.deleteOne();
    res.status(200).json({
      status: true,
      message: 'Chat deleted successfully',
      data: chatResponse,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: 'Error deleting chat', data: null });
  }
};

const fetchAllChats = async (req, res) => {
  const userId = req.query.user_id;
  const userType = req.query.user_type;

  let chats;

  try {
    if (userType === 'Client') {
      chats = await Chat.find({ company: userId, client_deleted: false })
        .populate({
          path: 'influencer',
          populate: { path: 'niches', strictPopulate: false },
        })
        .exec();
    } else {
      chats = await Chat.find({ influencer: userId, influencer_deleted: false })
        .populate('company')
        .exec();
    }

    res
      .status(200)
      .json({ status: true, message: 'Chats retrieved', data: chats });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error occured, try later.',
      data: null,
    });
  }
};

const fetchSingleChat = async (req, res) => {
  const influencerId = req.query.influencer_id;
  const company_owner_id = req.query.company_owner_id;

  try {
    const chat = await Chat.findOne({
      company: company_owner_id,
      influencer: influencerId,
    })
      .populate('influencer')
      .exec();

    if (chat) {
      res
        .status(200)
        .json({ status: true, message: 'Chat retrieved', data: chat });
    } else {
      res
        .status(404)
        .json({ status: true, message: 'No chat found', data: null });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error occured, try later.',
      data: null,
    });
  }
};

const updateChatStatus = async (req, res) => {
  const { chat_id, user_type } = req.body;

  try {
    const chat = await Chat.findById(chat_id);
    if (user_type == 'Client') {
      chat.new_messages_count_client = 0;
    } else {
      chat.new_messages_count = 0;
    }
    const updatedChat = await chat.save();
    // if (chat) {
    //   chat.new_messages_count = 0;
    //   await chat.save();

    return res.status(200).json({
      status: true,
      message: 'Chat status updated.',
      data: updatedChat,
    });
    // } else {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: 'Chat not found.' });
    // }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: 'Internal server error.' });
  }
};

module.exports = {
  addChat,
  deleteChat,
  fetchAllChats,
  updateChat,
  fetchSingleChat,
  updateChatStatus,
};
