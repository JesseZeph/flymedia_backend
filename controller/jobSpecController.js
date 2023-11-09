const JobSpecification = require('../models/JobSpecification');

module.exports = {
    addJobSpecification: async (req, res) => {

        const newJobSpecification =  new JobSpecification(req.body);

        try {
            await newJobSpecification.save();
            res.status(200).json({
                message: "Job Specification added successfully"
            })
        } catch (error) {
            res.status(500).json({
                message: "Job Specification added successfully",
            });
        }
    },

    getJobSpecification: async (req, res) => {
        const jobSpecId = req.params.id;
        try {
            const jobSpec = await JobSpecification.findById({_id: jobSpecId, }, {__v: 0})
            if (!jobSpec) {
                return res.status(500).json({
                    status: false, message: error.message
                })
            }
            res.status(200).json(jobSpec)
        } catch (error) {
            res.status(500).json({status: false, message: "Error getting job specification"});
        }

    },

    getAllJobsSpecification: async(req, res) => {
        try {
            const jobSpecifications = await JobSpecification.find({}, {__v: 0})
            res.status(200).json(jobSpecifications)
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });  
        }
        
    }
}
