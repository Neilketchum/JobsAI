const express = require('express');
const upload = require('./config/multerConfig');
const controllers = require('./controllers');
const { getFilesByEmail, deleteFile } = require('./controllers/uploadController');
const { googleLogin } = require('./controllers/authController');

const router = express.Router();

// API endpoint to upload PDF
router.post('/upload', upload.single('pdf'), controllers.uploadController.uploadFile);

// API endpoint to create profile
router.post('/profile', controllers.profileController.createProfileController);

// API endpoint to retrieve all files for a given email ID
router.get('/files/:emailId', getFilesByEmail);

// API endpoint to delete a file
router.delete('/files/delete', deleteFile);

router.post('/analyze-resume', controllers.analyisController.analyzeResume);

// API endpoint for Google login
router.post('/auth/google-login', googleLogin);

module.exports = router;
