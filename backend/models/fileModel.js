const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  email: { type: String, required: true },
  fileUrl: { type: String, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model('File', fileSchema);
