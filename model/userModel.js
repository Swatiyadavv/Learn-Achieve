const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: true },
  loginOtp: String,
  loginOtpExpire: Date,
});
module.exports = mongoose.model("User", userSchema);
