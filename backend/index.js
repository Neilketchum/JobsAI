// filename - index.js 
const express = require('express');
const bodyParser = require('body-parser');
const upload = require('./config/multerConfig');
const mongoose = require('./config/mongooseConfig');
const uploadController = require('./controllers/uploadController');
const testUploadController = require('./controllers/testUploadController');
const { PORT } = require('./constants/constants');
const app = require('./config/expressConfig');
const dotenv = require('dotenv');
dotenv.config();


// API endpoint to upload PDF
app.post('/upload', upload.single('pdf'), uploadController.uploadFile);

// API endpoint to test upload to cloud storage
app.post('/test-upload', upload.single('file'), testUploadController.testUploadFile);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});