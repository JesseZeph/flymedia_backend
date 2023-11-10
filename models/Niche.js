const mongoose = require('mongoose');

const NicheSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
},{timestamps: true});

module.exports = mongoose.model('Niche', NicheSchema);
