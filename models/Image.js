const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    cloudinaryURL: {
        type: String,
        required: true,
    },
    companyDetails: {
        type: String,
        required: true,
    },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
