const mongoose = require('mongoose');


const CompanySchema = new mongoose.Schema({
    companyName: {type: String, required: true},
    companyHq: {type: String, required: true},
    website: {type: String, required: true},
    companyEmail: {type: String, required: true},
    memberContact: {type: String, required: true},
    isVerified: {type: Boolean, default: false},
    // userId: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true
    // }
}, {timestamps: true});

module.exports = mongoose.model('VerifyCompany', CompanySchema)