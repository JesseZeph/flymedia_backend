const mongoose = require('mongoose');

const companyDetailsSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    companyDescription: {
        type: String,
        required: true,
    },
});

const CompanyDetails = mongoose.model('CompanyDetails', companyDetailsSchema);

module.exports = CompanyDetails;
