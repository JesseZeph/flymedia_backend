const InfluencerApplication = require('../models/influencerApplication');
const CampaignUpload = require('../models/CampaignUpload')
const InfluencerProfile = require('../models/InfluencerProfile');

module.exports = {
    applyForCampaign: async (req, res) => {
        try {
            const { influencerId, campaignId} = req.body;

            const [influencer, campaign] = await Promise.all([
                InfluencerProfile.findById(influencerId),
                CampaignUpload.findById(campaignId),
            ]);

            if (!influencer || !campaign) {
                return res.status(404).json({ success: false, message: 'Influencer, campaign, or job specification not found' });
            }

            if(!influencer.imageURL || !influencer.firstAndLastName || !influencer.location || !influencer.noOfTikTokFollowers || !influencer.noOfTikTokLikes || !influencer.niches || !influencer.bio) {
                return res.status(400).json({success: false, message: 'Complete your influencer profile before applying for campaigns'});
            }

            const newApplication = new InfluencerApplication({
                influencer: {
                    _id: influencer._id,
                    name: influencer.firstAndLastName,
                    followerCount: influencer.noOfTikTokFollowers,
                },
                campaignId,
            });

            await newApplication.save();

            res.status(201).json({ success: true, message: 'Application submitted successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error submitting application' });
        }
    },


    getInfluencerApplications: async (req, res) => {
        const { campaignId } = req.params;

        try {
            const influencerApplications = await InfluencerApplication.find({ campaignId })
                .populate('influencer._id', 'firstAndLastName noOfTikTokFollowers ratings');

            if (!influencerApplications || influencerApplications.length === 0) {
                return res.status(404).json({ success: false, message: 'No influencer applications found for the campaign' });
            }

            const formattedApplications = influencerApplications.map(application => ({
                influencerName: application.influencer.name,
                followerCount: application.influencer.followerCount,
                createdAt: application.createdAt,
            }));

            res.status(200).json({ success: true, influencerApplications: formattedApplications });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Error fetching influencer applications for the campaign' });
        }
    },
}