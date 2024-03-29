const cloudinary = require('../utils/cloudinary');
const CampaignUpload = require('../models/CampaignUpload');
const Company = require('../models/VerifyCompany');
const User = require('../models/User');
const InfluencerProfile = require('../models/InfluencerProfile');
const ActiveCampaign = require('../models/activeCampaigns');
const GroupEventHandler = require('./event_handlers/groupChat');
const AssignCampaignNotifier = require('./event_handlers/assignedCampaign');

const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

async function updateRejectedCampaign(campignId) {
  await CampaignUpload.findByIdAndUpdate(campignId, { assigned: null });
}

eventEmitter.on('create-group', (client, influencer, campaign) => {
  GroupEventHandler.createGroupChat(client, influencer, campaign);
});

eventEmitter.on('campaign-assigned', (mail, name, campaign) => {
  AssignCampaignNotifier.sendMail(mail, name, campaign);
});

module.exports = {
  uploadCampaignImageAndDesc: async (req, res) => {
    try {
      const { user_id, ...others } = req.body;
      const company = await Company.findOne({ userId: user_id }).exec();
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
      // if (company.campaignsInMonth >= req.body.max_campaigns) {
      //   return res.status(406).json({
      //     success: false,
      //     message: 'Maximum allowed campaigns reached',
      //   });
      // }
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
        // 'rateFrom',
        'rate',
        'viewsRequired',
        // 'maxApplicants',
        'minFollowers',
        'jobDescription',
      ];
      const missingFields = requiredFields.filter((field) => !others[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`,
        });
      }
      const newImage = new CampaignUpload({
        user: user_id,
        company: company._id,
        companyDescription: req.body.companyDescription,
        imageUrl: cloudinaryResult.secure_url,
        jobTitle: req.body.jobTitle,
        country: req.body.country,
        // rateFrom: req.body.rateFrom,
        rate: req.body.rate,
        // maxApplicants: req.body.maxApplicants,
        minFollowers: req.body.minFollowers,
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
      // company.campaignsInMonth += 1;
      // await company.save();
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
      ).exec();

      res.status(200).json(logoWithDesc);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  deleteCampaign: async (req, res) => {
    const logoWithDescId = req.params.id;

    try {
      await CampaignUpload.findByIdAndDelete(logoWithDescId).exec();
      res
        .status(200)
        .json({ status: true, message: 'Campaign successfully deleted' });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
  getAllCampaignImageAndDesc: async (req, res) => {
    const pageNumber = req.query.page;
    const skipNumber = (pageNumber - 1) * 20;
    try {
      const logoWithDesc = await CampaignUpload.find(
        {
          assigned: null,
        },
        null,
        { skip: skipNumber, limit: 20, sort: '-updatedAt' }
      ).exec();

      if (logoWithDesc.length > 0) {
        return res.status(200).json(logoWithDesc);
      } else {
        return res
          .status(404)
          .json({ status: false, message: 'No campaigns found.' });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  clientSpecificCampaign: async (req, res) => {
    try {
      const userId = req.query.id;

      const user = await User.findById(userId).exec();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const userCampaigns = await CampaignUpload.find({ user: userId }).exec();

      res.status(200).json({ success: true, campaigns: userCampaigns });
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

  assignInfluencer: async (req, res) => {
    const details = req.body;

    try {
      const assignedInfluencer = await InfluencerProfile.findOne({
        email: details.influencer_mail,
      });

      if (
        !assignedInfluencer ||
        assignedInfluencer.firstAndLastName != details.influencer_name
      ) {
        return res.status(400).json({
          status: false,
          message: 'Influencer with provided details not found',
          data: null,
        });
      }
      await ActiveCampaign.findOneAndDelete({ campaign: details.campaign_id });

      const campaign = new ActiveCampaign({
        campaign: details.campaign_id,
        influencer: assignedInfluencer._id,
        client: req.user.id,
      });
      const new_campaign = await campaign.save();
      const updatedCampaign = await CampaignUpload.findByIdAndUpdate(
        details.campaign_id,
        {
          assigned: assignedInfluencer._id,
        }
      );
      eventEmitter.emit(
        'campaign-assigned',
        assignedInfluencer.email,
        assignedInfluencer.firstAndLastName,
        updatedCampaign.jobTitle
      );
      return res.status(200).json({
        status: true,
        message: 'Influencer assigned successfully.',
        data: new_campaign,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'An error occured with assigning influencer',
        data: null,
      });
    }
  },

  acceptCampaign: async (req, res) => {
    const { accepted, active_campaign_id } = req.body;
    const userAccepted = accepted == 'Accept';
    try {
      const updatedCampaign = await ActiveCampaign.findByIdAndUpdate(
        active_campaign_id,
        {
          status: userAccepted ? 'In Progress' : 'Rejected',
          message: userAccepted
            ? 'Campaign has not been completed'
            : 'Assigned Influencer refused campaign.',
          accepted: userAccepted,
        },
        {
          returnDocument: 'after',
        }
      );
      if (userAccepted) {
        eventEmitter.emit(
          'create-group',
          updatedCampaign.client,
          updatedCampaign.influencer,
          updatedCampaign.campaign
        );
      } else {
        updateRejectedCampaign(updatedCampaign.campaign);
      }
      return res.status(201).json({
        status: true,
        message: 'Campaign updated successfully.',
        data: {
          status: updatedCampaign.status,
          message: updatedCampaign.message,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'An error occured with accepting campaign',
        data: null,
      });
    }
  },
};
