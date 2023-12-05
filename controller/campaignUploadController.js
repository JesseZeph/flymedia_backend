const cloudinary = require('../utils/cloudinary');
const CampaignUpload = require('../models/CampaignUpload');
const Company = require('../models/VerifyCompany')
const User = require('../models/User')


module.exports = {
    uploadCampaignImageAndDesc: async (req, res) => {
        try {
            const userId = req.user.id; 
            const company = await Company.findOne({ userId: userId });

            if (!company) {
                return res.status(404).json({ success: false, message: "Company not found for the user" });
            }

            if (!company.isVerified) {
                return res.status(403).json({ success: false, message: "Company not verified. Please wait for admin approval." });
            }

            const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);

            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file provided' });
            }

            const newImage = new CampaignUpload({
                company: company._id,
                companyDescription: req.body.companyDescription,
                imageUrl: cloudinaryResult.secure_url,
                jobTitle: req.body.jobTitle,
                country: req.body.country,
                rateFrom: req.body.rateFrom,
                rateTo: req.body.rateTo,
                viewsRequired: req.body.viewsRequired,
                jobDescription: req.body.jobDescription
            });

            const savedImage = await newImage.save();

            res.status(200).json({
                success: true,
                message: 'File Uploaded!',
                campaignUpload: savedImage, 
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error uploading or saving the file' });
        }
    },

    getCampaignImageAndDesc: async (req, res) => {
        const logoWithDescId = req.params.id;

        try {
            const logoWithDesc = await CampaignUpload.findById(logoWithDescId).populate('company');
                if(logoWithDesc) {
                    return res.status(200).json({logoWithDesc})
                }else {
                    return res.status(404).json({status: false, message: "Logo with details not found"})
                }
        } catch (error) {
           
            res.status(500).json({ status: false, message: error.message });
        }
    },
    getAllCampaignImageAndDesc: async (req, res) => {
                try {
                    const logoWithDesc = await CampaignUpload.find({}, { __v: 0 }).populate('company');
                    res.status(200).json(logoWithDesc);
                } catch (error) {
                    res.status(500).json({ status: false, message: error.message });
                }
            }
};
