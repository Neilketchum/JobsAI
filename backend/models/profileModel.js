const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
        email: { type: String, required: true,unique: true },
        name: { type: String, required: true },
        lastLogin: { type: Date, default: Date.now },
        profilePicture: { type: String, default: '' },
        linkedinUrl: { type: String, required: false },
        githubUrl: { type: String, required: false },
        personalWebsiteUrl: { type: String, required: false },
        phoneNumber: { type: String, required: false },
    });


module.exports = mongoose.model('Profile', profileSchema);
