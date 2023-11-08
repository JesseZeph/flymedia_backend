const cloudinary = require('../utils/cloudinary');
const Image = require('../models/Image');

module.exports = {
    imageUpload: async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file provided' });
        }

        try {
            const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);

            
            const newImage = new Image({
                companyDetails: req.body.companyDetails,
                cloudinaryURL: cloudinaryResult.secure_url,
            });

            const savedImage = await newImage.save();

            res.status(200).json({
                success: true,
                message: 'File Uploaded!',
                cloudinaryURL: cloudinaryResult.secure_url,
                mongoDBURL: savedImage.cloudinaryURL, 
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Error uploading or saving the file' });
        }
    },

    getImageDetails: async (req, res) => {
        const logoWithDescId = req.params.id;

        try {
            const logoWithDesc = await Image.findOne({_id: logoWithDescId})
                if(logoWithDesc) {
                    return res.status(200).json({logoWithDesc})
                }else {
                    return res.status(404).json({status: false, message: "Logo with details not found"})
                }
        } catch (error) {
            console.err("Error while retrieving logo with job description");
            res.status(500).json({ status: false, message: error.message });
        }
    },
    getAllImageDetails: async (req, res) => {
                try {
                    const logoWithDesc = await Image.find({}, {__v: 0});
                    res.status(200).json(logoWithDesc);
                } catch (error) {
                    console.error("Error while retrieving job details:", error);
                    res.status(500).json({ status: false, message: error.message });
                }
            }
};
