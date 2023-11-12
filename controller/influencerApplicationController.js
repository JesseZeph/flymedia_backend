const InfluencerApplication = require('../models/influencerApplication');
const influencerProfile = require('../models/InfluencerProfile')
const CampaignUpload = require('../models/CampaignUpload')
const JobSpecification = require('../models/JobSpecification');
const InfluencerProfile = require('../models/InfluencerProfile');

module.exports = {
    applyForCampaign: async (req, res) => {
        try {
            const { influencerId, campaignId, jobSpecId } = req.body;

            const [influencer, campaign, jobspec] = await Promise.all([
                InfluencerProfile.findById(influencerId),
                CampaignUpload.findById(campaignId),
                JobSpecification.findById(jobSpecId),
            ]);

            if (!influencer || !campaign || !jobspec) {
                return res.status(404).json({ success: false, message: 'Influencer, campaign, or job specification not found' });
            }

            const newApplication = new InfluencerApplication({
                influencer: {
                    _id: influencer._id,
                    name: influencer.firstAndLastName,
                    followerCount: influencer.noOfTikTokFollowers,
                },
                campaignId,
                jobSpecId,
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
                .populate('influencer._id', 'firstAndLastName noOfTikTokFollowers');

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