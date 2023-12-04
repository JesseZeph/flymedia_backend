const mongoose = require('mongoose');


const CompanySchema = new mongoose.Schema({
    companyName: {type: String, required: true},
    companyHQ: {type: String, required: true},
    website: {type: String, required: true},
    companyEmail: {type: String, required: true},
    memberContact: {type: String, required: true},
    isVerified: {type: Boolean, default: false},
    userId: {type: mongoose.Schema.Types.ObjectId, unique: true
    }
}, {timestamps: true});

module.exports = mongoose.model('VerifyCompany', CompanySchema)