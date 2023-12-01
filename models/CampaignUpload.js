const mongoose = require('mongoose');

const companyDetailsSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VerifyCompany',
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    companyDescription: {
        type: String,
        required: true,
    },
    jobTitle: { type: String, required: true },
  country: { type: String, required: true },
  rateFrom: { type: String, required: true },
  rateTo: { type: String, required: true },
  viewsRequired: { type: String, required: true, enum: ['10,000 - 50,000', '50,000 - 200,000', '200,000 - 500,000', '500,000 - 1,000,000', '1,000,000 - 3,000,000'] },
  jobDescription: { type: String, required: true },
});

const CompanyDetails = mongoose.model('CampaignDetails', companyDetailsSchema);

module.exports = CompanyDetails;
