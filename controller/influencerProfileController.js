const cloudinary = require('../utils/cloudinary');
const InfluencerProfile = require('../models/InfluencerProfile');
const Niche = require('../models/Niche');
const User = require('../models/User');

module.exports = {
  uploadProfilePhoto: async (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'No file provided' });
    }

    try {
      const userId = req.params.id;

      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: 'User ID is required' });
      }

      const influencer = await User.find({ userId });

      if (!influencer) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized. Only registered users can update profile.',
        });
      }

      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);

      const niches = req.body.niches;
      const nicheArray = niches.split(',');
      const nicheObjects = [];

      for (const name of nicheArray) {
        const existingNiche = await Niche.findOne({ name: name.trim() });
        if (existingNiche) {
          nicheObjects.push(existingNiche);
        } else {
          const newNiche = await Niche.create({ name: name.trim() });
          nicheObjects.push(newNiche);
        }
      }

      const newInfluencerProfile = new InfluencerProfile({
        userId: userId,
        imageURL: cloudinaryResult.secure_url,
        firstAndLastName: req.body.firstAndLastName,
        location: req.body.location,
        tikTokLink: req.body.tikTokLink,
        email: req.body.email,
        noOfTikTokFollowers: req.body.noOfTikTokFollowers,
        noOfTikTokLikes: req.body.noOfTikTokLikes,
        postsViews: req.body.postsViews,
        niches: nicheObjects,
        bio: req.body.bio,
      });

      const savedInfluencerProfile = await newInfluencerProfile.save();

      res.status(200).json({
        success: true,
        message: 'Profile Updated!',
        savedInfluencerProfile,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Error uploading or saving the file',
      });
    }
  },

  updateInfluencerProfile: async (req, res) => {
    const influencerId = req.params.id;
    const niches = req.body.niches;
    const nicheArray = niches.split(',');

    try {
      const userId = req.user.id;

      if (!userId) {
        return res.status(403).json({
          success: false,
          message:
            'Unauthorized. Only registered users can update their profile.',
        });
      }

      let existingProfile = await InfluencerProfile.findById(influencerId);

      if (!existingProfile) {
        return res
          .status(404)
          .json({ success: false, message: 'Influencer profile not found' });
      }

      // if (existingProfile.userId.toString() !== userId.toString()) {
      //   return res.status(403).json({
      //     success: false,
      //     message:
      //       "Unauthorized. You don't have permission to update this profile.",
      //   });
      // }

      if (req.file) {
        existingProfile.imageURL = (
          await cloudinary.uploader.upload(req.file.path)
        ).secure_url;
      }
      if (req.body.firstAndLastName) {
        existingProfile.firstAndLastName = req.body.firstAndLastName;
      }
      if (req.body.location) {
        existingProfile.location = req.body.location;
      }
      if (req.body.tikTokLink) {
        existingProfile.tikTokLink = req.body.tikTokLink;
      }
      if (req.body.email) {
        existingProfile.email = req.body.email;
      }
      if (req.body.noOfTikTokFollowers) {
        existingProfile.noOfTikTokFollowers = req.body.noOfTikTokFollowers;
      }
      if (req.body.noOfTikTokLikes) {
        existingProfile.noOfTikTokLikes = req.body.noOfTikTokLikes;
      }
      if (req.body.postsViews) {
        existingProfile.postsViews = req.body.postsViews;
      }
      if (req.body.bio) {
        existingProfile.bio = req.body.bio;
      }
      if (req.body.niches) {
        const nicheObjects = [];

        for (const niche of nicheArray) {
          const existingNiche = await Niche.findOne({ name: niche.trim() });
          if (existingNiche) {
            nicheObjects.push(existingNiche._id);
          } else {
            const newNiche = await Niche.create({ name: niche.trim() });
            nicheObjects.push(newNiche._id);
          }
        }

        existingProfile.niches = nicheObjects;
      }

      const updatedInfluencerProfile = await existingProfile.save();

      res.status(200).json({
        success: true,
        message: 'Profile Updated!',
        cloudinaryURL: updatedInfluencerProfile.cloudinaryURL,
        mongoDBURL: updatedInfluencerProfile.cloudinaryURL,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error updating the influencer profile',
      });
    }
  },

  getInfluencerProfile: async (req, res) => {
    try {
      const userId = req.params.id;

      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: 'User ID is required' });
      }

      const userProfile = await InfluencerProfile.findOne({ userId }).populate(
        'niches'
      );

      if (!userProfile) {
        return res
          .status(404)
          .json({ success: false, message: 'User profile not found' });
      }

      const simplifiedNiches = userProfile.niches.map((niche) => ({
        _id: niche._id,
        name: niche.name,
      }));

      const influencerProfile = {
        _id: userProfile._id,
        imageURL: userProfile.imageURL,
        firstAndLastName: userProfile.firstAndLastName,
        location: userProfile.location,
        tikTokLink: userProfile.tikTokLink,
        email: userProfile.email,
        noOfTikTokFollowers: userProfile.noOfTikTokFollowers,
        noOfTikTokLikes: userProfile.noOfTikTokLikes,
        postsViews: userProfile.postsViews,
        niches: simplifiedNiches,
        bio: userProfile.bio,
        userId: userProfile.userId,
      };

      res.status(200).json(influencerProfile);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Error retrieving user profile' });
    }
  },

  getInfluencerProfileClientSide: async (req, res) => {
    try {
      const userId = req.params.id;

      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: 'User ID is required' });
      }

      const userProfile = await InfluencerProfile.findOne({ userId }).populate(
        'niches'
      );

      if (!userProfile) {
        return res
          .status(404)
          .json({ success: false, message: 'User profile not found' });
      }

      const simplifiedNiches = userProfile.niches.map((niche) => ({
        _id: niche._id,
        name: niche.name,
      }));

      const influencerProfile = {
        _id: userProfile._id,
        imageURL: userProfile.imageURL,
        firstAndLastName: userProfile.firstAndLastName,
        location: userProfile.location,
        noOfTikTokFollowers: userProfile.noOfTikTokFollowers,
        noOfTikTokLikes: userProfile.noOfTikTokLikes,
        postsViews: userProfile.postsViews,
        niches: simplifiedNiches,
        bio: userProfile.bio,
        userId: userProfile.userId,
      };

      res.status(200).json(influencerProfile);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Error retrieving user profile' });
    }
  },

  allInfluencers: async (req, res) => {
    const pageNumber = parseInt(req.query.page) || 1;
    const pageSize = 20;
    const skipNumber = (pageNumber - 1) * pageSize;
  
    try {
      const influencerProfiles = await InfluencerProfile.find()
        .skip(skipNumber)
        .limit(pageSize)
        .sort('-updatedAt')
        .populate({
          path: 'niches',
          select: 'name', 
        });;
  
      if (!influencerProfiles || influencerProfiles.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No influencer profiles found',
        });
      }

     
      const simplifiedProfiles = influencerProfiles.map((profile) => ({
        _id: profile._id,
        imageURL: profile.imageURL,
        firstAndLastName: profile.firstAndLastName,
        location: profile.location,
        tikTokLink: profile.tikTokLink,
        email: profile.email,
        noOfTikTokFollowers: profile.noOfTikTokFollowers,
        noOfTikTokLikes: profile.noOfTikTokLikes,
        postsViews: profile.postsViews,
        bio: profile.bio,
        niches: profile.niches.map((niche) => ({
          _id: niche._id,
          name: niche.name,
        })),
        userId: profile.userId,
      }));
  
      res.status(200).json(simplifiedProfiles);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving influencer profiles',
      });
    }
  },  
};
