const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  email: { type: String, required: true },
  fileUrl: { type: String, required: true },
  parseResumeText: { type: Object, required: true }
});

module.exports = mongoose.model('File', fileSchema);
