const CampaignUpload = require('../models/CampaignUpload');
const JobSpecification = require('../models/JobSpecification');
const VerifyCompany = require('../models/VerifyCompany');

module.exports = {
    previewCampaignAndJobSpecs: async (req, res) => {
        try {
            const companyId = req.params.companyId;
            const jobSpecId = req.params.jobSpecId;

            const campaignDetails = await CampaignUpload.findOne({ company: companyId });

            const jobSpecDetails = await JobSpecification.findById(jobSpecId).populate('company');

            const companyDetails = await VerifyCompany.findById(companyId);

            if (!companyDetails) {
                return res.status(404).json({ success: false, message: 'Company details not found' });
            }

            const previewData = {
                companyDetails: {
                    companyName: companyDetails.companyName,
                    companyHQ: companyDetails.companyHQ,
                },
                campaignDetails: {
                    companyDescription: campaignDetails ? campaignDetails.companyDescription : null,
                    imageUrl: campaignDetails ? campaignDetails.imageUrl : null,
                },
                jobSpecDetails: {
                    jobTitle: jobSpecDetails ? jobSpecDetails.jobTitle : null,
                    country: jobSpecDetails ? jobSpecDetails.country : null,
                    rateFrom: jobSpecDetails ? jobSpecDetails.rateFrom : null,
                    rateTo: jobSpecDetails ? jobSpecDetails.rateTo : null,
                    viewsRequired: jobSpecDetails ? jobSpecDetails.viewsRequired : null,
                    jobDescription: jobSpecDetails ? jobSpecDetails.jobDescription : null,
                },
            };

            res.status(200).json({ success: true, previewData });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Error retrieving preview data' });
        }
    },
};
