const mongoose = require("mongoose");

const pendingStudentSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  dob: Date,
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
  schoolName: String,
   registerBy: {
    type: String,
    enum: ["Student", "Coordinator"],
    default: "Student"
  },
uniqueCode: {
  type: String,
  required: function () {
    return this.registerBy === "Coordinator";
  }
},

  // Contact fields to be added in Step 2
  email: String,
  mobile: String,
  addressLine1: String,
  addressLine2: String,
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
  taluka: String,
  pinCode: String,

  otp: String,
  otpExpiresAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("PendingStudent", pendingStudentSchema);
