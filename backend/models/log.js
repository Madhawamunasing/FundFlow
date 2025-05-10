const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: String,
  timestamp: { type: Date, default: Date.now },
  input: Object,
  score: Number,
  status: String
});

module.exports = mongoose.model('Log', logSchema);