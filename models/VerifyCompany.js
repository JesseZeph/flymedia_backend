const mongoose = require('mongoose');


const CompanySchema = new mongoose.Schema({
    companyName: {type: String, required: true},
    companyHQ: {type: String, required: true},
    website: {type: String, required: true},
    companyEmail: {type: String, required: true},
    memberContact: {type: String, required: true},
    isVerified: {type: Boolean, default: false},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        validate: {
            validator: function(userId) {
                return userId !== undefined;
            },
            message: "The user field is required."
        }
    }
}, {timestamps: true});

module.exports = mongoose.model('VerifyCompany', CompanySchema)