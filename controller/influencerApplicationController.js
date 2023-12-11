const InfluencerApplication = require('../models/influencerApplication');
const CampaignUpload = require('../models/CampaignUpload');
const InfluencerProfile = require('../models/InfluencerProfile');

module.exports = {
    applyForCampaign: async (req, res) => {
        try {
            const { campaignId } = req.body;
            const influencer = req.user;

            if (!influencer) {
                return res.status(404).json({
                    success: false,
                    message: 'Influencer not found in the request',
                });
            }

            const influencerProfile = await InfluencerProfile.findOne({ id: influencer._id });

            if (!influencerProfile) {
                return res.status(404).json({
                    success: false,
                    message: 'Influencer profile not found',
                    details: 'Please make sure the influencer profile is created for the given user.',
                });
            }

            const newApplication = new InfluencerApplication({
                influencerId: influencerProfile._id,
                campaignId,
            });

            await newApplication.save();

            res.status(200).json({
                    influencerName: influencerProfile.firstAndLastName,
                    followerCount: influencerProfile.noOfTikTokFollowers,
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error submitting application' });
        }
    },

    
    getInfluencerApplications: async (req, res) => {
        try {
            const { campaignId } = req.params;

            if (!campaignId) {
                return res.status(400).json({
                    success: false,
                    message: 'Campaign ID is required.',
                });
            }

            
            const applications = await InfluencerApplication.find({ campaignId })
                .populate({
                    path: 'influencerId',
                    model: 'InfluencerProfile',
                    select: 'firstAndLastName noOfTikTokFollowers',
                });

            res.status(200).json({
                applications: applications.map(application => ({
                    influencerName: application.influencerId.firstAndLastName,
                    followerCount: application.influencerId.noOfTikTokFollowers,
                })),
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error retrieving applications for the campaign' });
        }
    },

    
};
