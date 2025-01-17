const express = require('express');
const upload = require('./config/multerConfig');
const controllers = require('./controllers');
const { getFilesByEmail, deleteFile } = require('./controllers/uploadController');
const { googleLogin } = require('./controllers/authController');
const authMiddleware = require('./middleware/authMiddleware');

const router = express.Router();

// API endpoint to upload PDF
router.post('/upload', authMiddleware, upload.single('pdf'), controllers.uploadController.uploadFile);

// API endpoint to create profile
router.post('/profile', authMiddleware, controllers.profileController.createProfileController);

// API endpoint to retrieve all files for a given email ID
router.get('/files/:emailId', authMiddleware, getFilesByEmail);

// API endpoint to retrieve Profile for a given email ID
router.get('/profile/:email', authMiddleware, controllers.profileController.getProfileController);

// API endpoint to update Profile for a given email ID
router.put('/profile/update', authMiddleware, controllers.profileController.updateProfileController);

// API endpoint to delete a file
router.delete('/files/delete', authMiddleware, deleteFile);

router.post('/analyze-resume', authMiddleware, controllers.analyisController.analyzeResume);

router.post('/generate-cover-letter',authMiddleware, controllers.analyisController.generateCoverLetter);

// API endpoint for Google login
router.post('/auth/google-login', googleLogin);

module.exports = router;
