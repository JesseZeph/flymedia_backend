const mongoose = require('mongoose');

const JobSpecificationSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  country: { type: String, required: true },
  rateFrom: { type: Number, required: true },
  rateTo: { type: Number, required: true },
  viewsRequired: { type: String, required: true, enum: ['10,000 - 50,000', '50,000 - 200,000', '200,000 - 500,000', '500,000 - 1,000,000', '1,000,000 - 3,000,000'] },
  jobDescription: { type: String, required: true },

});

const JobPosting = mongoose.model('JobSpecification', JobSpecificationSchema);

module.exports = JobPosting;
