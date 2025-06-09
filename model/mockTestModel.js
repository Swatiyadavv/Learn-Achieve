const mongoose = require("mongoose");

const mockTestSchema = new mongoose.Schema({
  mockTestName: { type: String, required: true },
  medium: [{ type: String, required: true }],
  class: [{ type: String, required: true }],
  duration: { type: Number, required: true },
  subjects: [{ type: String, required: true }],
  totalQuestions: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
   status: { type: String, enum: ["active", "inactive"], default: "inactive" }, // new field
}, { timestamps: true });

const MockTest = mongoose.model("MockTest", mockTestSchema);
module.exports = MockTest;