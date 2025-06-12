const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  email: String,
  password: String,
  otp: String,
  otpExpire: Date,
});

module.exports = mongoose.model("PendingUser", pendingUserSchema);