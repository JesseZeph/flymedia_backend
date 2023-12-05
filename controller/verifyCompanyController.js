const Company = require('../models/VerifyCompany')
const User = require('../models/User');


module.exports = {

    addCompany: async (req, res) => {
        try {
            const userId = req.user.id; 

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const newCompany = new Company({
                companyName: req.body.companyName,
                companyHq: req.body.companyHq,
                website: req.body.website,
                companyEmail: req.body.companyEmail,
                memberContact: req.body.memberContact,
                userId: user._id, 
            });

            await newCompany.save();

            res.status(200).json({ success: true, message: "Company Details added successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: `Adding Company Details failed. Error: ${error.message}` });
        }
    },
    verificationStatus: async (req, res) => {
        const companyId = req.params.id;

        try {
            const adminUser = await User.findById(req.user.id);

            if (!adminUser || !adminUser.userType ==="SuperAdmin") {
                return res.status(403).json({ status: false, message: "Unauthorized. Only admins can verify companies." });
            }

            const company = await Company.findById(companyId);

            if (!company) {
                return res.status(404).json({ status: false, message: "Company not found!" });
            }
            
            company.isVerified = !company.isVerified;
            await company.save();

            res.status(200).json({ status: true, message: `Company verification toggled. New status: ${company.isVerified}` });


        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "Error toggling company verification" });
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
            await Company.findByIdAndDelete(companyId);
            res.status(200).json({status: true, message: "company successfully deleted"});
        } catch (error) {
            res.status(500).json({status: false, message: "Error deleting company"});            
        }
    },

}