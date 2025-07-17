const mongoose = require('mongoose');

const coordinatorSchema = new mongoose.Schema({
  name: { type: String, required: true ,  lowercase: true,trim: true},
  emailId: { type: String, required: true, unique: true },
  mobileNo: { type: String, required: true },
  dob: {
  type: String,
  required: true,
  match: /^\d{4}-\d{2}-\d{2}$/ 
},
  qualification: { type: String },
  addressLine1: { type: String },
  addressLine2: { type: String },
  state: { type: String },
  district: { type: String },
  taluka: { type: String },
  uniqueCode: { type: String, required: true, unique: true },

  pincode: { type: String },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Coordinator', coordinatorSchema);
