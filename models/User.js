const mongoose = require('mongoose');
const crypto = require('crypto')


const UserSchema = new mongoose.Schema({
    fullname: {type: String, required: true,},
    email: {type: String, required: true, unique: true},
    uid: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    passwordChangedDate: {type: Date},
    userType: {type: String, required: true, default: "Client", enum: ['Client', 'Influencer', 'Admin', 'SuperAdmin']}, 
    profile: {
        type: String,
        require: true,
        default: 'https://shorturl.at/DLX09'
    },
    passwordResetToken: String,
    passwordResetExpires: Date,


}, {timestamps: true});

UserSchema.methods.generatePasswordResetToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 3000000;

    return resetToken;


}

module.exports = mongoose.model('User', UserSchema)