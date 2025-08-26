// const mongoose = require('mongoose');

// const userMockTestSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   mockTest: {
//     type: String,  // Or ObjectId if mockTests are in a collection
//     required: true
//   },
//   packageId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Package',
//     required: true
//   },
//   assignedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('UserMockTest', userMockTestSchema);
const mongoose = require("mongoose");

const userMockTestResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mockTestId: { type: mongoose.Schema.Types.ObjectId, ref: "MockTest", required: true },
  attemptNumber: { type: Number, default: 1 },
  attempted: { type: Number, default: 0 },
  correct: { type: Number, default: 0 },
  wrong: { type: Number, default: 0 },
  unattempted: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  responses: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "QuestionBank" }, // ✅ FIXED
      selectedOption: { type: String },
      isCorrect: { type: Boolean }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("UserMockTestResult", userMockTestResultSchema);
