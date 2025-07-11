

const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
  email: String,
  password: String,
  otp: String,
  otpExpire: Date,
  referredBy: { type: String, default: null } // ✅ Add this
});

module.exports = mongoose.model("PendingUser", pendingUserSchema);
