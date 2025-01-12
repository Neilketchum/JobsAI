const {createProfile} = require('../services/profileServices');   
const Profile = require('../models/profileModel');

exports.createProfileController = async (req,res) =>{
    try{
       await createProfile(req,res);
    }catch(error){
        console.error('Error in createProfileController:', error);
        res.status(500).send('Internal server error');
    }
}

exports.updateProfileController = async (req, res) => {
  const { email, ...updateFields } = req.body;
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!updatedProfile) {
      return res.status(404).send('Profile not found');
    }
    res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error) {
    console.error('Error in updateProfileController:', error);
    res.status(500).send('Internal server error');
  }
};