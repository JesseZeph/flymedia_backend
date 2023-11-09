const Company = require('../models/Company')

module.exports = {
    addCompany: async (req, res) => {

        const newCompany = new Company(req.body);

        try {
            await newCompany.save();
            res.status(200).json({message: "Company Details added successfuly"})
        } catch (error) {
            res.status(500).json({message: "Adding Company Details added failed"})
        }
    },

    verificationStatus: async (req, res) => {

        const companyId = req.params.id;

        try {
            const company = await Company.findById(companyId)
            company.isVerified = !company.isVerified
            await company.save()
            res.status(200).json({status: true, message: "Verifification successfully toggled", isVerified: company.isVerified})
        } catch (error) {
            res.status(500).json({status: false, message: "Error toggling company verification"})
        }
    },

    getAllCompany: async (req, res) => {
        try {
            const company = await Company.find({}, { __v: 0 })
            res.status(200).json(company)
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });  
        }
    },

    getCompany: async (req, res) => {
        const companyId = req.params.id;

        try {
            const company = await Company.findById({_id: companyId})
            if(!company) {
                return res.status(404).json({status: false, message: "Company not found!"})
            }    
            res.status(200).json(company);
        } catch (error) {
            res.status(500).json({status: false, message: "Error getting restaurant"});
        }
    },

    deleteCompany: async(req, res) => {
        const companyId = req.params.id;

        try {
            const company = await Company.findById({_id: companyId})
            if(!company) {
                return res.status(404).json({status: false, message: "company not found!"})
            }
            await company.findByIdAndDelete(companyId);
            res.status(200).json({status: true, message: "company successfully deleted"});
        } catch (error) {
            res.status(500).json({status: false, message: "Error deleting company"});            
        }
    },
}