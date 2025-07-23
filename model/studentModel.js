const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  dob: String,
  gender: String,
  medium: String,
  class: String,
  schoolName: String,
  registerBy: String,
  uniqueCode: String,
  contactDetails: {
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    addressLine1: String,
    addressLine2: String,
    state: String,
    district: String,
    taluka: String,
    pinCode: String,
    otp: { type: String },
otpExpiry: { type: Date },

  },
  password: String // hashed password
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
