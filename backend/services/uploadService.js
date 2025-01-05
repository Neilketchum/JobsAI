const { storage, bucketName } = require('../config/gcsConfig');
const File = require('../models/fileModel');

exports.uploadFileToGCS = async ( file, emailId, parseResumeText) => {
  return new Promise((resolve, reject) => {
    const blob = storage.bucket(bucketName).file(file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
      console.error('Blob stream error:', err);
      reject('Error uploading file.');
    });

    blobStream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;

      const newFile = new File({  email: emailId, fileUrl: publicUrl, parseResumeText });
      await newFile.save();

      resolve({ message: 'File uploaded successfully', url: publicUrl,parseResumeText });
    });

    blobStream.end(file.buffer);
  });
};
