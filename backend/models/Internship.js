const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  companyName: String,
  domain: String,
  duration: String,
  location: String,
  startDate: Date,
  stipend: String,
  offerLetter: String,

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  feedback: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);