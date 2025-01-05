const Profile = require('../models/profileModel');
exports.createProfile = async (req, res) => {
    try {
        const { name, email, profilePicture } = req.body;
        const profile = new Profile({ name, email, profilePicture });
        const existingProfile = await Profile.findOne({ email });
        if (existingProfile) {
            existingProfile.lastLogin = Date.now();
            existingProfile.profilePicture = profile.profilePicture;
            await existingProfile.save();
        } else {
            await profile.save();
        }
        res.status(201).json({ message: 'Profile created successfully' });
    } catch (error) {
        console.error('Error in createProfile:', error);
    }
};