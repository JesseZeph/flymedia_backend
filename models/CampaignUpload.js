const mongoose = require('mongoose');

const companyDetailsSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VerifyCompany',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  viewsRequired: {
    type: String,
    required: true,
    enum: [
      '10k - 50k',
      '50k - 200k',
      '200k - 500k',
      '500k - 1m',
      '1m and above',
    ],
  },
  jobDescription: { type: String, required: true },
  assigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InfluencerProfile',
    default: null,
  },
});

const CompanyDetails = mongoose.model('CampaignDetails', companyDetailsSchema);

module.exports = CompanyDetails;
