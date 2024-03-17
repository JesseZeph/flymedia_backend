const Campaigns = require('../../models/CampaignUpload');
const Users = require('../../models/User');
const GroupChat = require('../../models/groupChat');

const createGroupChat = async (clientId, influencerId, campaignId) => {
  try {
    const admins = await Users.find({ userType: 'Admin' });
    const campaign = await Campaigns.findById(campaignId);
    const assignedAdmin = admins.at(getRandomInt(admins.length - 1));
    const groupChatName = campaign.jobTitle + ' Group Chat';
    await GroupChat.create({
      influencer: influencerId,
      client: clientId,
      admin: assignedAdmin._id,
      group_name: groupChatName,
      group_image: campaign.imageUrl,
    });
  } catch (error) {
    console.log({ error });
  }
};

const campaignCompleted = async (campaignId) => {
  try {
    const destroyedGroup = await GroupChat.findOneAndDelete({
      campaign: campaignId,
    });
  } catch (error) {
    console.log({ error });
  }
};

function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

module.exports = {
  createGroupChat,
  campaignCompleted,
};
