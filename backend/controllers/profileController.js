const {createProfile} = require('../services/profileServices');   

exports.createProfileController = async (req,res) =>{
    try{
       await createProfile(req,res);
    }catch(error){
        console.error('Error in createProfileController:', error);
    }
}