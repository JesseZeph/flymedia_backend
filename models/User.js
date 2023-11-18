const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    uid: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    passwordChangedDate: { type: Date },
    verificationCode: { type: String },
    isVerified: { type: Boolean, default: false },
    passwordResetVerificationCode: { type: String },
    passwordResetExpires: { type: Date },
    userType: {
        type: String,
        required: true,
        default: "Client",
        enum: ['Client', 'Influencer', 'Admin', 'SuperAdmin']
    },
    profile: {
        type: String,
        require: true,
        default: 'https://shorturl.at/DLX09'
    },
}, { timestamps: true });

UserSchema.methods.generatePasswordResetVerificationCode = function () {
    const min = 100000;
    const max = 999999;
    this.passwordResetVerificationCode = Math.floor(Math.random() * (max - min + 1) + min).toString();
    this.passwordResetExpires = Date.now() + 300000; 
    return this.passwordResetVerificationCode;
};

UserSchema.methods.generateVerificationCode = function () {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

module.exports = mongoose.model('User', UserSchema);
