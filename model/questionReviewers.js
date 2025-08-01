const mongoose = require("mongoose");

const questionBankSchema = new mongoose.Schema({
  // mockTestId: { type: mongoose.Schema.Types.ObjectId, ref: "MockTest", required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "ClassMaster" },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject"},
  medium: { type: String, enum: ["Hindi", "English", "Semi-English", "Marathi"] },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  module: { type: String},
  topicName: { type: String },
  typeOfQuestion: { type: String, enum: ["General", "Comprehensive", "Poem"]},
  questionType: { type: String, enum: ["Question Bank", "SAT Exam"] },

  //  Only for General
  questionText: { type: String },
  options: [{ type: String }],
  correctAnswer: { type: String },
}, { timestamps: true });

questionBankSchema.index({
  classId: 1, subjectId: 1, medium: 1, module: 1, topicName: 1,
  typeOfQuestion: 1, questionType: 1
}, { unique: true });

module.exports = mongoose.model("QuestionReviewers", questionBankSchema);
