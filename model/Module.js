const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  name: { type: String, required: true,lowercase: true,trim: true  },
  studyMaterialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyMaterial',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);
