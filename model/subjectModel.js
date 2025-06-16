const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  image: { type: String, default: null },
  status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Subject', subjectSchema);