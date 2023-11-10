const cloudinary = require('../utils/cloudinary');
const CampaignUpload = require('../models/CampaignUpload');
const Company = require('../models/VerifyCompany')


module.exports = {
    uploadCampaignImageAndDesc: async (req, res) => {
        const companyId = req.params.id
      
        try {
            const company = await Company.findById(companyId)
            if(!company) {
                return res.status(404).json({ status: false, message: "Company not found!" });
            }
            if (!company.isVerified) {
                return res.status(403).json({ status: false, message: "Company not verified. Please wait for admin approval." });
            }
            const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);

            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file provided' });
            }       
            const newImage = new CampaignUpload({
                companyDescription: req.body.companyDescription,
                imageUrl: cloudinaryResult.secure_url,
            });

            const savedImage = await newImage.save();

            res.status(200).json({
                success: true,
                message: 'File Uploaded!',
                imageUrl: cloudinaryResult.secure_url,
                mongoDBURL: savedImage.imageUrl, 
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Error uploading or saving the file' });
        }
    },

    getCampaignImageAndDesc: async (req, res) => {
        const logoWithDescId = req.params.id;

        try {
            const logoWithDesc = await CampaignUpload.findById({_id: logoWithDescId })
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
                    const logoWithDesc = await CampaignUpload.find({}, {__v: 0});
                    res.status(200).json(logoWithDesc);
                } catch (error) {
                    res.status(500).json({ status: false, message: error.message });
                }
            }
};
