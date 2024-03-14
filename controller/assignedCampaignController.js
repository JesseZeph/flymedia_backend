const ActiveCampaign = require('../models/activeCampaigns');
const Points = require('../models/influencer.points');
const GroupEventHandler = require('./event_handlers/groupChat');
const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

eventEmitter.on('campaign-complete', (campaign) => {
  GroupEventHandler.campaignCompleted(campaign);
});

const fetchUserCampaigns = async (req, res) => {
  //for influencers, user_id is influencer profile id
  //for clients, it is the actual user_id
  const user_id = req.params.id;
  const type = req.query.type;

  try {
    if (type == 'Influencer') {
      const activeCampaigns = await ActiveCampaign.find({
        influencer: user_id,
      })
        .populate({
          path: 'campaign',
          populate: { path: 'company', select: 'companyName -_id' },
          select: '_id imageUrl jobTitle country jobDescription rate company',
        })
        .exec();
      return res.status(200).json({
        status: true,
        message: 'Campaigns retrieved successfully',
        data: activeCampaigns,
      });
    } else {
      const activeCampaigns = await ActiveCampaign.find({
        client: user_id,
      })
        .populate(
          'campaign',
          '_id imageUrl jobTitle country jobDescription rate'
        )
        .populate('influencer', '_id imageURL firstAndLastName location')
        .exec();

      return res.status(200).json({
        status: true,
        message: 'Campaigns retrieved successfully',
        data: activeCampaigns,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Could not fetch campaigns',
      data: null,
    });
  }
};

const campaignAction = async (req, res) => {
  //for influencers, id is influencer profile id
  //for clients, it is the actual user_id
  const { id, user_type, active_campaign_id } = req.body;
  try {
    if (user_type == 'Influencer') {
      let activeCampaign = await ActiveCampaign.findById(active_campaign_id);
      if (activeCampaign.influencer != id) {
        return res.status(403).json({
          status: false,
          message: 'You have not been assigned this campaign',
          data: null,
        });
      }
      activeCampaign.completed = true;
      activeCampaign.status = activeCampaign.verified_complete
        ? 'Completed'
        : 'Pending';
      activeCampaign.message = activeCampaign.verified_complete
        ? 'Campaign completed.'
        : 'Awaiting client approval on contract';
      const campaign = await activeCampaign.save();

      return res.status(200).json({
        status: true,
        message: 'Campaign updated successfully',
        data: campaign,
      });
    } else {
      let activeCampaign = await ActiveCampaign.findById(active_campaign_id);
      if (activeCampaign.client != id) {
        return res.status(403).json({
          status: false,
          message: 'You do not own this campaign',
          data: null,
        });
      }
      activeCampaign.verified_complete = true;
      activeCampaign.status = 'Completed';
      activeCampaign.completed_date = Date.now();
      activeCampaign.message = 'Campaign completed.';
      const campaign = await activeCampaign.save();
      updateInfluencerPoints(campaign.influencer);
      eventEmitter.emit('campaign-complete', campaign.campaign);
      return res.status(200).json({
        status: true,
        message: 'Campaign updated successfully',
        data: campaign,
      });
    }
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: false,
      message: 'Error occured, try again later',
      data: null,
    });
  }
};

async function updateInfluencerPoints(influencerId) {
  try {
    const influencerPoint = await Points.findOne({ influencer: influencerId });
    if (influencerPoint.campaigns_completed == 0) {
      influencerPoint.completed_tasks.push('2');
      influencerPoint.campaigns_completed = 1;
      influencerPoint.total_points += 1;
      await influencerPoint.save();
    } else if (influencerPoint.campaigns_completed == 4) {
      influencerPoint.completed_tasks.push('3');
      influencerPoint.campaigns_completed = 5;
      influencerPoint.total_points += 8;
      await influencerPoint.save();
    } else {
      influencerPoint.campaigns_completed += 1;
      await influencerPoint.save();
    }
  } catch (error) {
    console.log({ err });
  }
}

module.exports = {
  fetchUserCampaigns,
  campaignAction,
};
