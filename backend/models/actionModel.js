const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  actionType: { type: String, required: true },
  additionalInfo: { type: String, required: false },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('action', actionSchema);
