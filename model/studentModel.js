const mongoose = require("mongoose");

const contactDetailsSchema = new mongoose.Schema({
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  addressLine1: String,
  addressLine2: String,
  state: { type: String, required: true },
  district: { type: String },
  taluka: { type: String },
  pinCode: String
}, { _id: false });

const studentSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  dob: String,
  gender: String,
  medium: String,
  class: String,
  schoolName: String,
  registerBy: {
    type: String,
    enum: ["Student", "Coordinator"],
    required: true
  },
  uniqueCode: String,
  contactDetails: contactDetailsSchema,
  password: String,
  otp: String,
  otpExpiry: Date,

  // Payment / discount / package fields
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" }, 
  totalAmount: { type: Number, default: 0 },          // Package total
  discountGiven: { type: Number, default: 0 },       // Discount applied
  paymentReceived: { type: Number, default: 0 },     // Amount received
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
