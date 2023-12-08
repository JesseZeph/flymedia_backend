const cloudinary = require('../utils/cloudinary');
const CampaignUpload = require('../models/CampaignUpload');
const Company = require('../models/VerifyCompany');
const User = require('../models/User');

module.exports = {
  uploadCampaignImageAndDesc: async (req, res) => {
    try {
      const userId = req.user.id;
      const company = await Company.findOne({userId});
      console.log(userId)
      if (!company) {
        return res
          .status(404)
          .json({ success: false, message: 'Company not found for the user' });
      }
      if (!company.isVerified) {
        return res.status(403).json({
          success: false,
          message: 'Company not verified. Please wait for admin approval.',
        });
      }
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: 'No file provided' });
      }
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);

      const requiredFields = [
        'companyDescription',
        'jobTitle',
        'country',
        'rateFrom',
        'rateTo',
        'viewsRequired',
        'jobDescription',
      ];
      const missingFields = requiredFields.filter((field) => !req.body[field]);
      console.log({ missingFields });

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`,
        });
      }
      const newImage = new CampaignUpload({
        user: userId,
        company: company._id,
        companyDescription: req.body.companyDescription,
        imageUrl: cloudinaryResult.secure_url,
        jobTitle: req.body.jobTitle,
        country: req.body.country,
        rateFrom: req.body.rateFrom,
        rateTo: req.body.rateTo,
        viewsRequired: req.body.viewsRequired,
        jobDescription: req.body.jobDescription,
      });
      const savedImage = await newImage.save();
      res.status(200).json({
        success: true,
        message: 'File Uploaded!',
        campaignUpload: {
          ...savedImage.toObject(),
          imageUrl: cloudinaryResult.secure_url,
        },
      });
    } catch (error) {
      console.error({ error });
      return res.status(500).json({
        success: false,
        message: 'Error uploading or saving the file',
      });
    }
  },

  getCampaignImageAndDesc: async (req, res) => {
    const logoWithDescId = req.params.id;

    try {
      const logoWithDesc = await CampaignUpload.findById(
        { _id: logoWithDescId },
        { company: 0, __v: 0 }
      );

      res.status(200).json(logoWithDesc);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
  getAllCampaignImageAndDesc: async (req, res) => {
    try {
      const logoWithDesc = await CampaignUpload.find({}, { __v: 0 });
      res.status(200).json(logoWithDesc);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  clientSpecificCampaign: async (req, res) => {
    try {
      const userId = req.params.id;

      const user = await User.findById({_id: userId});
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const userCampaigns = await CampaignUpload.find({user});

      res.status(200).json(userCampaigns);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user campaigns',
      });
    }
  },
  searchCampaign: async (req, res) => {
    try {
      const results = await CampaignUpload.aggregate([
        [
          {
            $search: {
              index: 'campaignsearch',
              text: {
                query: req.params.key,
                path: {
                  wildcard: '*',
                },
              },
            },
          },
        ],
      ]);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
