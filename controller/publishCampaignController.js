const CampaignUpload = require('../models/CampaignUpload');
const JobSpecification = require('../models/JobSpecification');
const VerifyCompany = require('../models/VerifyCompany');

module.exports = {
    publishCampaignAndJobSpecs: async (req, res) => {
        try {
            const companyId = req.params.companyId;
            const jobSpecId = req.params.jobSpecId;

            const campaignDetails = await CampaignUpload.findOne({ company: companyId });

            const jobSpecDetails = await JobSpecification.findById(jobSpecId);

            const companyDetails = await VerifyCompany.findById(companyId);

            if (companyDetails) {
                companyDetails.isPublished = true;
                await companyDetails.save();
            }

            if (campaignDetails) {
                campaignDetails.isPublished = true;
                await campaignDetails.save();
            }

            if (jobSpecDetails) {
                jobSpecDetails.isPublished = true;
                await jobSpecDetails.save();
            }

            res.status(200).json({ success: true, message: 'Data published successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Error publishing data' });
        }
    },

};
