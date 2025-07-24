// const mongoose = require('mongoose');

// const studyMaterialSchema = new mongoose.Schema({
//   class: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'ClassMaster',
//     required: true,
//   },
//   subject: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Subject',
//     required: true,
//   },
//   medium: {
//     type: String,
//     enum: ['Hindi', 'English'],
//     required: true,
//   }
// //   materialName: {
// //     type: String,
// //   },
// //   materialUrl: {
// //     type: String,
// //   }
// }, { timestamps: true });

// module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClassMaster',
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  medium: {
    type: String,
    enum: ['Hindi', 'English','Marathi','Semi-English'],
    default: 'English',
    required:true,
  },
//   materialName: {
//     type: String,
//     required: true,
//   },
//   materialUrl: {
//     type: String,
//   },
  status: {
    type: Boolean,
    default: true, // true = active
  }
}, { timestamps: true });

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
