const { OAuth2Client } = require('google-auth-library');
const Profile = require('../models/profileModel');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let userProfile = await Profile.findOne({ email: payload.email });
    if (!userProfile) {
      userProfile = new Profile({
        email: payload.email,
        name: payload.name,
        profilePicture: payload.picture,
      });
      await userProfile.save();
    }

    const token = jwt.sign({ email: userProfile.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'User logged in successfully', profile: userProfile, token });
  } catch (error) {
    console.error('Error in googleLogin:', error);
    res.status(500).send('Internal server error');
  }
};