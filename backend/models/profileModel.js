const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
        email: { type: String, required: true,unique: true },
        name: { type: String, required: true },
        lastLogin: { type: Date, default: Date.now },
        profilePicture: { type: String, default: '' },
    });


module.exports = mongoose.model('Profile', profileSchema);
