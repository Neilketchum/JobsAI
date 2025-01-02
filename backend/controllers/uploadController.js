const uploadService = require('../services/uploadService');

exports.uploadFile = async (req, res) => {
  try {
    const { userId, emailId } = req.body;
    const file = req.file;
    if (!file || !emailId) {
      return res.status(400).send('No file uploaded or email ID missing.');
    }
    const result = await uploadService.uploadFileToGCS(userId, file, emailId);
    res.status(200).send(result);
  } catch (error) {
    console.error('Error in uploadController:', error);
    res.status(500).send({ message: 'Internal server error', error: error.message });
  }
};
