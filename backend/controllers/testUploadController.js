const uploadService = require('../services/uploadService');

exports.testUploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
    const result = await uploadService.uploadFileToGCS('testUserId', file);
    res.status(200).send(result);
  } catch (error) {
    console.error('Error in testUploadController:', error);
    res.status(500).send('Internal server error');
  }
};
