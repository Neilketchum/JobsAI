const express = require('express');
const upload = require('./config/multerConfig');
const controllers = require('./controllers');

const router = express.Router();

// API endpoint to upload PDF
router.post('/upload', upload.single('pdf'), controllers.uploadController.uploadFile);

// API endpoint to test upload to cloud storage
router.post('/test-upload', upload.single('file'), controllers.testUploadController.testUploadFile);

// API endpoint to create profile
router.post('/profile', controllers.profileController.createProfileController);

module.exports = router;
