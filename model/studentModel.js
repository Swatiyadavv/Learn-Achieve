const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, lowercase: true },
  middleName: { type: String, trim: true, lowercase: true },
  lastName: { type: String, required: true, trim: true, lowercase: true },
  dob: { type: Date, required: true },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },
  medium: {
    type: String,
    enum: ["English", "Hindi", "Marathi"],
    required: true
  },
  class: {
    type: String,
    enum: [
      "Nur", "LKG", "UKG",
      "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th",
      "11th", "12th", "13th", "14th"
    ],
    required: true
  },
  schoolName: { type: String, trim: true, lowercase: true },
  registerBy: {
    type: String,
    enum: ["Student", "Coordinator"],
    default: "Student"
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  isVerified: { type: Boolean, default: false },
  loginOtp: { type: String, default: null },
  loginOtpExpires: { type: Date, default: null },

  contactDetails: {
    email: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"]
    },
    addressLine1: { type: String, trim: true, lowercase: true },
    addressLine2: { type: String, trim: true, lowercase: true },
    state: {
      type: String,
      enum: [
        "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
        "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
        "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
        "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
        "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
      ]
    },
    district: {
      type: String,
      enum: ["Khargone", "Indore"]
    },
    taluka: { type: String, trim: true, lowercase: true },
    pinCode: {
      type: String,
      match: [/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit Indian PIN code"]
    }
  }
}, { timestamps: true });

// Format DOB to yyyy-mm-dd when sending response
studentSchema.methods.toJSON = function () {
  const student = this.toObject();
  if (student.dob) {
    student.dob = student.dob.toISOString().split("T")[0];
  }
  return student;
};

module.exports = mongoose.model("Student", studentSchema);
