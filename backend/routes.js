const express = require('express');
const upload = require('./config/multerConfig');
const controllers = require('./controllers');
const { getFilesByEmail } = require('./controllers/uploadController');

const router = express.Router();

// API endpoint to upload PDF
router.post('/upload', upload.single('pdf'), controllers.uploadController.uploadFile);

// API endpoint to create profile
router.post('/profile', controllers.profileController.createProfileController);

// API endpoint to retrieve all files for a given email ID
router.get('/files/:emailId', getFilesByEmail);

module.exports = router;
