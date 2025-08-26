const mongoose = require("mongoose");

const studentBankSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, unique: true },
  accountHolderName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  branch: { type: String, required: true },
  ifscCode: { type: String, required: true },
  accountType: { type: String, enum: ["Saving", "Current"], required: true },
  panNumber: { type: String, required: true },
  cancelledCheque: { type: String } // path of uploaded image
}, { timestamps: true });

module.exports = mongoose.model("StudentBank", studentBankSchema);
