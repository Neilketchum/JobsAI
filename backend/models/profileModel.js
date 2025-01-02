const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema({
        email: { type: String, required: true,unique: true },
        name: { type: String, required: true },
        userId: { type: String, required: true ,unique: true},
        lastLogin: { type: Date, default: Date.now },
    });
    
module.exports = mongoose.model('Profile', profileSchema);
