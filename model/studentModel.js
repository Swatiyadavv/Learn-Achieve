const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: String,
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  medium: { type: String },
  class: { type: String },
  schoolName: { type: String },
  registerBy: { type: String },

  password: { type: String, required: true },

  isVerified: { type: Boolean, default: false },
  loginOtp: { type: String, default: null },
  loginOtpExpires: { type: Date, default: null },

  contactDetails: {
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    addressLine1: { type: String },
    addressLine2: { type: String },
    state: {
      type: String,
      enum: [
        "Andaman and Nicobar Islands",
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chandigarh",
        "Chhattisgarh",
        "Dadra and Nagar Haveli",
        "Daman and Diu",
        "Delhi",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jammu and Kashmir",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Ladakh",
        "Lakshadweep",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Puducherry",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal"
      ]
    },
    district: {
      type: String,
      enum: ["Khargone", "Indore"]
    },
    taluka: { type: String },
    pinCode: { type: String }
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