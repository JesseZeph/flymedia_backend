const User = require('../models/User');



module.exports = {
    getUser: async (req, res) => {
        const userId = req.user.id;

        try {
            const user = await User.findById({ _id: userId, }, {password: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({message: "Error retrieving user!", error: error.message})
            
        }
    },

    deleteUser: async (req, res) => {
        const userId = req.user.id;

        try {
            await User.findOneAndDelete(userId);
            res.status(200).json({status: true, message: "User deleted successfully"}); 
        } catch (error) {
            res.status(500).json({message: "Error deleting user!", error: error.message});

        }

    },

    updateUser: async (req, res) => {
        const userId = req.user.id;

        try {
             await User.findByIdAndUpdate(userId, {
                $set: req.body
            }, {new: true})
            res.status(200).json({ status: true, message: "User updated successfully!"})
        } catch (error) {
            res.status(500).json({message: "Error updating user!", error: error.message});
        }
    },

    getTotalUsers: async (req, res) => {
        try {
            const totalUsers = await User.countDocuments();
            res.status(200).json({ totalUsers });
        } catch (error) {
            res.status(500).json({ message: "Error getting total users", error: error.message });
        }
    },
    getTotalInfluencers: async (req, res) => {
        try {
            const totalInfluencers = await User.countDocuments({ userType: 'Influencer' });
            res.status(200).json({ totalInfluencers });
        } catch (error) {
            res.status(500).json({ message: "Error getting total influencers", error: error.message });
        }
    },

}