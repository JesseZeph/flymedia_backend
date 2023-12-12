const InfluencerApplication = require('../models/influencerApplication');
const CampaignUpload = require('../models/CampaignUpload');
const InfluencerProfile = require('../models/InfluencerProfile');

module.exports = {
  applyForCampaign: async (req, res) => {
    try {
      const { userId, campaign_id } = req.body;

      const hasApplied = await InfluencerApplication.find({
        influencerId: userId,
        campaignId: campaign_id,
      }).exec();

      if (hasApplied) {
        return res.status(200).json({
          success: false,
          message: 'You already applied for this campaign',
        });
      }

      //   const [influencer, campaign] = await Promise.all([
      //     InfluencerProfile.findById(userId),
      //     CampaignUpload.findById(campaign_id),
      //   ]);

      const influencerVerified = await InfluencerProfile.findById(userId);

      if (!influencerVerified) {
        return res.status(404).json({
          success: false,
          message: 'This user profile not found.',
        });
      }

      if (
        !influencer.imageURL ||
        !influencer.firstAndLastName ||
        !influencer.location ||
        !influencer.noOfTikTokFollowers ||
        !influencer.noOfTikTokLikes ||
        !influencer.niches ||
        !influencer.bio ||
        !influencer.email ||
        !influencer.tikTokLink
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Complete your influencer profile before applying for campaigns',
        });
      }

      const newApplication = new InfluencerApplication({
        influencerId: userId,
        campaignId: campaign_id,
      });

      await newApplication.save();

      res
        .status(201)
        .json({ success: true, message: 'Application submitted successfully' });
    } catch (error) {
      console.error('Error:', error);
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

      // const formattedApplications = influencerApplications.map(
      //   (application) => ({
      //     influencerName: application.influencer.name,
      //     followerCount: application.influencer.followerCount,
      //     createdAt: application.createdAt,
      //   })
      // );

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
      const campaignApplicantsList = await InfluencerApplication.find({
        campaignId: campaign_id,
      })
        .populate('influencerId')
        .exec();

      if (!campaignApplicantsList || campaignApplicantsList.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No influencer applications found for the campaign',
        });
      }
      const formattedApplicants = campaignApplicantsList.map(
        (applicant) => applicant.influencerId
      );
      res.status(200).json({
        success: true,
        influencerApplications: formattedApplicants,
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching influencer applications for the campaign',
      });
    }
  },
};
