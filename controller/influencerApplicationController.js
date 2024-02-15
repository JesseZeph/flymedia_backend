const InfluencerApplication = require('../models/influencerApplication');
const CampaignUpload = require('../models/CampaignUpload');
const InfluencerProfile = require('../models/InfluencerProfile');

async function updateCampaign(campaignId) {
  let campaign = await CampaignUpload.findById(campaignId);
  campaign.numberOfApplicants += 1;
  if (campaign.maxApplicants == campaign.numberOfApplicants) {
    campaign.applicationsFull = true;
  }
  await campaign.save();
}
module.exports = {
  applyForCampaign: async (req, res) => {
    try {
      const userId = req.body.influencerId;
      const campaign_id = req.body.campaignId;

      const application = await InfluencerApplication.findOne({
        campaignId: campaign_id,
      }).exec();
      // if (application) {
      // }

      // const influencerVerified = await InfluencerProfile.findById(
      //   userId
      // ).exec();

      // if (!influencerVerified) {
      //   return res.status(404).json({
      //     success: false,
      //     message: 'This user profile not found.',
      //   });
      // }

      // if (
      //   !influencerVerified.imageURL ||
      //   !influencerVerified.firstAndLastName ||
      //   !influencerVerified.location ||
      //   !influencerVerified.noOfTikTokFollowers ||
      //   !influencerVerified.noOfTikTokLikes ||
      //   !influencerVerified.niches ||
      //   !influencerVerified.bio ||
      //   !influencerVerified.email ||
      //   !influencerVerified.tikTokLink
      // ) {
      //   return res.status(400).json({
      //     success: false,
      //     message:
      //       'Complete your influencer profile before applying for campaigns',
      //   });
      // }

      if (application) {
        const applied = application.influencers.includes(userId);
        if (applied) {
          return res.status(200).json({
            success: false,
            message: 'You already applied for this campaign',
          });
        }
        application.influencers.push(userId);

        await application.save();
      } else {
        const newApplication = new InfluencerApplication({
          campaignId: campaign_id,
        });
        newApplication.influencers.push(userId);
        await newApplication.save();
      }
      updateCampaign(campaign_id);

      return res
        .status(201)
        .json({ success: true, message: 'Application submitted successfully' });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Error submitting application' });
    }
  },

  getInfluencerApplications: async (req, res) => {
    const userId = req.query.id;
    try {
      const influencerApplicationsList = await InfluencerApplication.find({
        influencerId: userId,
      })
        .populate('campaignId')
        .exec();
      if (
        !influencerApplicationsList ||
        influencerApplicationsList.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message: 'No influencer applications found for the campaign',
        });
      }

      const formattedApplications = influencerApplicationsList.map(
        (application) => application.campaignId
      );

      res.status(200).json({
        success: true,
        influencerApplications: formattedApplications,
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching influencer applications for the campaign',
      });
    }
  },

  getCampaignApplicants: async (req, res) => {
    const campaign_id = req.query.id;

    try {
      const campaignApplicantsList = await InfluencerApplication.findOne({
        campaignId: campaign_id,
      })
        .populate({
          path: 'influencers',
          populate: { path: 'niches', strictPopulate: false },
        })
        .exec();
      if (!campaignApplicantsList) {
        return res.status(404).json({
          success: false,
          message: 'No campaigns found.',
        });
      }
      const formattedApplicants = campaignApplicantsList.influencers;

      res.status(200).json({
        success: true,
        influencerApplications: formattedApplicants ? formattedApplicants : [],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching influencer applications for the campaign',
      });
    }
  },
};
