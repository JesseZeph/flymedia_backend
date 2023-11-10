const Niche = require('../models/Niche')

module.exports = {
    getNiches: async (req, res) => {
        try {
            const niches = await Niche.find();
            res.status(200).json(niches);
        } catch (error) {
            console.error("Error retrieving niches", error);
        res.status(500).json({ status: false, error: "Error retrieving niches" });
        } 
    },
}