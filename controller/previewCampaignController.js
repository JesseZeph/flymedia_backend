const CampaignUpload = require('../models/CampaignUpload');
const VerifyCompany = require('../models/VerifyCompany');

module.exports = {
    previewCampaignAndJobSpecs: async (req, res) => {
        try {
            const companyId = req.params.companyId;
            const jobSpecId = req.params.jobSpecId;

            const campaignDetails = await CampaignUpload.findOne({ company: companyId });


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
                    jobTitle: campaignDetails ? campaignDetails.jobTitle : null,
                    jobTitle: campaignDetails ? campaignDetails.jobTitle : null,
                    country: campaignDetails ? campaignDetails.country : null,
                    rateFrom: campaignDetails ? campaignDetails.rateFrom : null,
                    rateTo: campaignDetails ? campaignDetails.rateTo : null,
                    viewsRequired: campaignDetails ? campaignDetails.viewsRequired : null,
                    jobDescription: campaignDetails ? campaignDetails.jobDescription : null,

                },
                
            };

            res.status(200).json({ success: true, previewData });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Error retrieving preview data' });
        }
    },
};
