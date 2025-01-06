const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  email: { type: String, required: true },
  fileUrl: { type: String, required: true },
  parseResumeText: { type: Object, required: true },
  dateUploaded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
