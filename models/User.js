const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    fullname: {type: String, required: true,},
    email: {type: String, required: true, unique: true},
    uid: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    resetToken: {type: String},
    resetExpires: { type: Date },
    passwordChangedDate: {type: Date},
    userType: {type: String, required: true, default: "Client", enum: ['Client', 'Influencer', 'Admin', 'SuperAdmin']}, 
    profile: {
        type: String,
        require: true,
        default: 'https://shorturl.at/DLX09'
    }

}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema)