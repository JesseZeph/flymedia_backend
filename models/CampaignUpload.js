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
});

const CompanyDetails = mongoose.model('CampaignDetails', companyDetailsSchema);

module.exports = CompanyDetails;
