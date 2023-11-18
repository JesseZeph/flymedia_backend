const cloudinary = require('../utils/cloudinary');
const InfluencerProfile = require('../models/InfluencerProfile');
const Niche = require('../models/Niche')

module.exports = {
    uploadProfilePhoto: async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file provided' });
        }

        try {

            const userId = req.user.id;

            if (!userId) {
                return res.status(403).json({ message: "Unauthorized. Only registered users can update profile." });
            }

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
                userId: userId, 
                imageURL: cloudinaryResult.secure_url,
                firstAndLastName: req.body.firstAndLastName,
                location: req.body.location,
                noOfTikTokFollowers: req.body.noOfTikTokFollowers,
                noOfTikTokLikes: req.body.noOfTikTokLikes,
                postsViews: req.body.postsViews,
                niches: nicheIds,
                bio: req.body.bio,
            });

            const savedInfluencerProfile = await newInfluencerProfile.save();

            res.status(200).json({
                success: true,
                message: 'Profile Updated!',
                imageURL: cloudinaryResult.secure_url,
                mongoDBURL: savedInfluencerProfile.imageURL, 
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Error uploading or saving the file' });
        }
    },

    updateInfluencerProfile: async (req, res) => {
        const influencerId = req.params.id;

        try {
            const userId = req.user.id; 
            if (!userId) {
                return res.status(403).json({ success: false, message: "Unauthorized. Only registered users can update their profile." });
            }

            let existingProfile = await InfluencerProfile.findById(influencerId);

            if (!existingProfile) {
                return res.status(404).json({ success: false, message: 'Influencer profile not found' });
            }

            if (existingProfile.userId.toString() !== userId.toString()) {
                return res.status(403).json({ success: false, message: "Unauthorized. You don't have permission to update this profile." });
            }

            existingProfile.imageURL = req.file ? (await cloudinary.uploader.upload(req.file.path)).secure_url : existingProfile.imageURL;
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

            if (req.body.rating && req.body.rating.stars) {
                const ratingUserId = userId;

                // Check if the user is not the influencer themselves
                if (existingProfile.userId.toString() !== ratingUserId.toString()) {
                    const rating = {
                        userId: ratingUserId,
                        stars: req.body.rating.stars,
                    };

                    existingProfile.ratings.push(rating);
                } else {
                    return res.status(400).json({ success: false, message: "Influencers cannot rate themselves." });
                }
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
    getInfluencerProfile: async (req, res) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(403).json({ success: false, message: "Unauthorized. Only registered users can access profiles." });
            }
    
            const userId = req.user.id;
            const influencerProfileId = req.params.id;
    
            const influencerProfile = await InfluencerProfile.findOne({ _id: influencerProfileId, userId }, { __v: 0 });
    
            if (influencerProfile) {
                return res.status(200).json({ success: true, influencerProfile });
            } else {
                return res.status(404).json({ success: false, message: "Influencer profile not found or unauthorized access" });
            }
        } catch (error) {
            console.error("Error while retrieving influencer profile:", error);
            return res.status(500).json({ success: false, message: "Error retrieving influencer profile", error: error.message });
        }
    },

    displayInfluencerProfile: async (req, res) => {
        try {
            // Ensure the user is registered and has an ID
            // if (!req.user || !req.user.id) {
            //     return res.status(403).json({ success: false, message: "Unauthorized. Only registered users can access profiles." });
            // }

            const influencerProfileId = req.params.id;

            const influencerProfile = await InfluencerProfile.findOne({ _id: influencerProfileId }, { __v: 0 });

            if (!influencerProfile) {
                return res.status(404).json({ success: false, message: "Influencer profile not found" });
            }

            return res.status(200).json({ success: true, influencerProfile });
        } catch (error) {
            console.error("Error while retrieving influencer profile:", error);
            return res.status(500).json({ success: false, message: "Error retrieving influencer profile", error: error.message });
        }
    },
    
    
    
};
