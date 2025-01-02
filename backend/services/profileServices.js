const Profile = require('../models/profileModel');

exports.createProfile = async (req, res) => {
    try {
        const { name, email, userId } = req.body;
        const profile = new Profile({ name, email, userId });
        const existingProfile = await Profile.findOne({ email });
        if (existingProfile) {
            existingProfile.lastLogin = Date.now();
            await existingProfile.save();
        } else {
            await profile.save();
        }
        res.status(201).json({ message: 'Profile created successfully' });
    } catch (error) {
        console.error('Error in createProfile:', error);
    }
};