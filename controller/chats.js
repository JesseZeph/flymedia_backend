const Chat = require('../models/ChatModel');

const addChat = async (req, res) => {
  const { company_owner_id, influencer_id, last_message, doc } = req.body;

  try {
    const newChat = new Chat({
      company: company_owner_id,
      influencer: influencer_id,
      last_message: last_message,
      firstore_doc: doc,
    });

    await newChat.save();

    res
      .status(200)
      .json({ success: true, message: 'New chat created', data: newChat });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error creating new chat', data: null });
  }
};

const updateChat = async (req, res) => {
  const { chat_id, last_message } = req.body;

  try {
    const chat = await Chat.findById(chat_id).exec();
    if (chat) {
      chat.last_message = last_message;

      chat.save().then((savedChat) => {
        res.status(200).json({
          success: true,
          message: 'Chat updated successfully',
          data: savedChat,
        });
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error updating chat', data: null });
  }
};

const deleteChat = async (req, res) => {
  const { chat_id } = req.body;
  try {
    const deletedDoc = await Chat.deleteOne({ _id: chat_id });
    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully',
      data: deletedDoc,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error deleting chat', data: null });
  }
};

const fetchAllChats = async (req, res) => {
  const userId = req.body.user_id;
  const userType = req.body.user_type;

  let chats;

  try {
    if (userType === 'Client') {
      chats = await Chat.find({ company: userId })
        .populate({
          path: 'influencer',
          populate: { path: 'niches', strictPopulate: false },
        })
        .exec();
    } else {
      chats = await Chat.find({ influencer: userId })
        .populate('company')
        .exec();
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

const fetchSingleChat = async (req, res) => {
  const influencerId = req.body.influencer_id;
  const company_owner_id = req.body.company_owner_id;
  let chats;

  try {
    const chat = await Chat.findOne({
      company: company_owner_id,
      influencer: influencerId,
    }).exec();
    console.log({ chat });

    if (chat) {
      res
        .status(200)
        .json({ success: true, message: 'Chat retrieved', data: chat });
    } else {
      res
        .status(404)
        .json({ success: true, message: 'No chat found', data: null });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error occured, try later.',
      data: null,
    });
  }
};

module.exports = {
  addChat,
  deleteChat,
  fetchAllChats,
  updateChat,
  fetchSingleChat,
};
