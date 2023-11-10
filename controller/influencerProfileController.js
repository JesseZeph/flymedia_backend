const cloudinary = require('../utils/cloudinary');
const InfluencerProfile = require('../models/InfluencerProfile');
const Niche = require('../models/Niche')

module.exports = {
    uploadProfilePhoto: async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file provided' });
        }

        try {
            const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);

            const selectedNicheNames = req.body.niches;

            const nichePromises = selectedNicheNames.map(async (name) => {
                const existingNiche = await Niche.findOne({name});
                if(existingNiche) {
                    return existingNiche._id;
                }else {
                    const newNiche = await Niche.create({name});
                    return newNiche._id;
                }
            });

            const nicheIds = await Promise.all(nichePromises)

            const newInfluencerProfile = new InfluencerProfile({
                cloudinaryURL: cloudinaryResult.secure_url,
                firstAndLastName: req.body.firstAndLastName,
                location: req.body.location,
                noOfTikTokFollowers: req.body.noOfTikTokFollowers,
                noOfTikTokLikes:req.body.noOfTikTokLikes,
                postsViews: req.body.postsViews,
                niches: nicheIds,
                bio: req.body.bio,
            });

            const savedInfluencerProfile = await newInfluencerProfile.save();

            res.status(200).json({
                success: true,
                message: 'Profile Updated!',
                cloudinaryURL: cloudinaryResult.secure_url,
                mongoDBURL: savedInfluencerProfile.cloudinaryURL, 
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Error uploading or saving the file' });
        }
    },

    getInfluencerProfile: async (req, res) => {
        const getInfluencerProfileId = req.params.id;

        try {
            const influencerProfile = await InfluencerProfile.findOne({_id: getInfluencerProfileId}, {__v: 0})
                if(influencerProfile) {
                    return res.status(200).json({influencerProfile})
                }else {
                    return res.status(404).json({status: false, message: "Logo with details not found"})
                }
        } catch (error) {
            console.err("Error while retrieving logo with job description");
            res.status(500).json({ status: false, message: error.message });
        }
    },
    updateInfluencerProfile: async (req, res) => {
        const influencerId = req.params.id;

        try {
            let existingProfile = await InfluencerProfile.findById(influencerId);

            if (!existingProfile) {
                return res.status(404).json({ success: false, message: 'Influencer profile not found' });
            }

            existingProfile.cloudinaryURL = req.file ? (await cloudinary.uploader.upload(req.file.path)).secure_url : existingProfile.cloudinaryURL;
            existingProfile.firstAndLastName = req.body.firstAndLastName || existingProfile.firstAndLastName;
            existingProfile.location = req.body.location || existingProfile.location;
            existingProfile.noOfTikTokFollowers = req.body.noOfTikTokFollowers || existingProfile.noOfTikTokFollowers;
            existingProfile.noOfTikTokLikes = req.body.noOfTikTokLikes || existingProfile.noOfTikTokLikes;
            existingProfile.postsViews = req.body.postsViews || existingProfile.postsViews;
            existingProfile.bio = req.body.bio || existingProfile.bio;

            if (req.body.niches && Array.isArray(req.body.niches)) {
                const nichePromises = req.body.niches.map(async (name) => {
                    const existingNiche = await Niche.findOne({ name });
                    if (existingNiche) {
                        return existingNiche._id;
                    } else {
                        const newNiche = await Niche.create({ name });
                        return newNiche._id;
                    }
                });

                existingProfile.niches = await Promise.all(nichePromises);
            }

            const updatedInfluencerProfile = await existingProfile.save();

            res.status(200).json({
                success: true,
                message: 'Profile Updated!',
                cloudinaryURL: updatedInfluencerProfile.cloudinaryURL,
                mongoDBURL: updatedInfluencerProfile.cloudinaryURL,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Error updating the influencer profile' });
        }
    },
    
};
