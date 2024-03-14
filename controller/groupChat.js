const GroupChat = require('../models/groupChat');

// Always the user id for influencers should be the influencer profile id

//for clients and admin, it is the regular user id

const fetchChats = async (req, res) => {
  const userId = req.query.user_id;
  const userType = req.query.user_type;

  let chats;

  try {
    switch (userType) {
      case 'Client':
        chats = await GroupChat.find({ client: userId }).exec();
        break;
      case 'Influencer':
        chats = await GroupChat.find({ influencer: userId }).exec();
        break;
      case 'Admin':
        chats = await GroupChat.find({ admin: userId }).exec();
        break;
    }
    res
      .status(200)
      .json({ success: true, message: 'Chats retrieved', data: chats });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error occured, try later.',
      data: null,
    });
  }
};

const updateChat = async (req, res) => {
  const { chat_id, last_message, user_type } = req.body;

  try {
    const chat = await GroupChat.findById(chat_id);
    chat.last_message = last_message;
    switch (user_type) {
      case 'Client':
        chat.new_message_count += 1;
        chat.new_message_count_admin += 1;
        break;
      case 'Influencer':
        chat.new_message_count_client += 1;
        chat.new_message_count_admin += 1;
        break;
      case 'Admin':
        chat.new_message_count += 1;
        chat.new_message_count_client += 1;
        break;
    }
    const updatedChat = await chat.save();

    res.status(200).json({
      success: true,
      message: 'Chat updated successfully',
      data: updatedChat,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error updating chat', data: null });
  }
};

const updateChatStatus = async (req, res) => {
  const { chat_id, user_type } = req.body;

  try {
    const chat = await GroupChat.findById(chat_id);
    switch (user_type) {
      case 'Client':
        chat.new_message_count_client = 0;
        break;
      case 'Influencer':
        chat.new_message_count = 0;
        break;
      case 'Admin':
        chat.new_message_count_admin = 0;
        break;
    }
    const updatedChat = await chat.save();

    return res.status(200).json({
      success: true,
      message: 'Chat status updated.',
      data: updatedChat,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = {
  fetchChats,
  updateChat,
  updateChatStatus,
};
