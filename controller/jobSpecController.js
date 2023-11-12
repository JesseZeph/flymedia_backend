const JobSpecification = require('../models/JobSpecification');
const Company = require('../models/VerifyCompany');

module.exports = {
    addJobSpecification: async (req, res) => {
        const companyId = req.params.id;

        try {
            const company = await Company.findById(companyId);
            if (!company) {
                console.error(error)
                return res.status(404).json({ status: false, message: "Company not found!" });
            }
            if (!company.isVerified) {
                return res.status(403).json({ status: false, message: "Company not verified. Please wait for admin approval." });
            }
            
            const { jobTitle, country, rateFrom, rateTo, viewsRequired, jobDescription } = req.body;

            const newJobSpecification = new JobSpecification({
                company: companyId,
                jobTitle,
                country,
                rateFrom,
                rateTo,
                viewsRequired,
                jobDescription,
            });

            await newJobSpecification.save();

            
            const populatedJobSpec = await JobSpecification.findById(newJobSpecification._id).populate('company')

            res.status(200).json({
                message: "Job Specification added successfully",
                jobSpecification: populatedJobSpec,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error adding job specification",
                error: error.message,
            });
        }
    },

    getJobSpecification: async (req, res) => {
        const jobSpecId = req.params.id;

        try {
            const jobSpec = await JobSpecification.findById(jobSpecId).populate('company');
            if (!jobSpec) {
                return res.status(404).json({ status: false, message: "Job Specification not found" });
            }
            res.status(200).json(jobSpec);
        } catch (error) {
            res.status(500).json({ status: false, message: "Error getting job specification" });
        }
    },

    getAllJobsSpecification: async (req, res) => {
        try {
            const jobSpecifications = await JobSpecification.find({}, { __v: 0 }).populate('company');
            res.status(200).json(jobSpecifications);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },
};
