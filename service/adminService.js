const Admin = require("../model/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ADMIN_ROLE = require("../enums/adminRoleEnum");
const RESPONSE_MESSAGES = require("../enums/responseMessageEnum");
const { generateOtp, sendOtpEmail } = require("./otpService");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";


const registerAdmin = async ({ email, password }) => {
  const existing = await Admin.findOne({ email });
  if (existing) throw new Error(RESPONSE_MESSAGES.ADMIN_EXISTS);

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOtp(6);
  const otpExpire = new Date(Date.now() + 10 * 60 * 1000); 

  const admin = await Admin.create({
    email,
    password: hashedPassword,
    role: ADMIN_ROLE.ADMIN,
    otp,
    otpExpire,
    isVerified: false,
  });

  await sendOtpEmail(email, otp, "Registration Verification");

  return { message: RESPONSE_MESSAGES.ADMIN_REGISTERED };
};

// Verify OTP for registration
const verifyRegistrationOtp = async ({ email, otp }) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error(RESPONSE_MESSAGES.ADMIN_NOT_FOUND);

  if (admin.isVerified)
    return { message: "Admin already verified, please login." };

  if (
    admin.otp !== otp ||
    !admin.otpExpire ||
    admin.otpExpire < new Date()
  ) {
    throw new Error(RESPONSE_MESSAGES.OTP_INVALID);
  }

  admin.isVerified = true;
  admin.otp = null;
  admin.otpExpire = null;
  await admin.save();

  return { message: RESPONSE_MESSAGES.OTP_VERIFIED };
};

// Login step 1: Check email + password, send OTP for 2-step verification
const loginAdminStep1 = async ({ email, password }) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error(RESPONSE_MESSAGES.ADMIN_NOT_FOUND);

  if (!admin.isVerified) throw new Error("Please verify your account first.");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error(RESPONSE_MESSAGES.INVALID_CREDENTIALS);

  const loginOtp = generateOtp(6);
  const loginOtpExpire = new Date(Date.now() + 10 * 60 * 1000);

  admin.loginOtp = loginOtp;
  admin.loginOtpExpire = loginOtpExpire;
  await admin.save();

  await sendOtpEmail(email, loginOtp, "Login 2-Step Verification");

  return { message: RESPONSE_MESSAGES.LOGIN_OTP_SENT };
};

// Login step 2: Verify OTP and issue JWT token
const verifyLoginOtp = async ({ email, otp }) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error(RESPONSE_MESSAGES.ADMIN_NOT_FOUND);

  if (
    admin.loginOtp !== otp ||
    !admin.loginOtpExpire ||
    admin.loginOtpExpire < new Date()
  ) {
    throw new Error(RESPONSE_MESSAGES.OTP_INVALID);
  }

  // Clear OTP after verification
  admin.loginOtp = null;
  admin.loginOtpExpire = null;
  await admin.save();

  // Issue token
  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { message: RESPONSE_MESSAGES.LOGIN_SUCCESS, token };
};

// Password reset: send OTP
const sendResetPasswordOtp = async (email) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error(RESPONSE_MESSAGES.ADMIN_NOT_FOUND);

  const otp = generateOtp(6);
  const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

  admin.otp = otp;
  admin.otpExpire = otpExpire;
  await admin.save();

  await sendOtpEmail(email, otp, "Password Reset");

  return { message: RESPONSE_MESSAGES.OTP_SENT };
};

// Verify OTP for password reset
const verifyResetPasswordOtp = async ({ email, otp }) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error(RESPONSE_MESSAGES.ADMIN_NOT_FOUND);

  if (
    admin.otp !== otp ||
    !admin.otpExpire ||
    admin.otpExpire < new Date()
  ) {
    throw new Error(RESPONSE_MESSAGES.OTP_INVALID);
  }

  // OTP valid, clear OTP (but keep isVerified true)
  admin.otp = null;
  admin.otpExpire = null;
  await admin.save();

  return { message: RESPONSE_MESSAGES.OTP_VERIFIED };
};

// Reset password after OTP verified
const resetPassword = async ({ email, newPassword }) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error(RESPONSE_MESSAGES.ADMIN_NOT_FOUND);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  admin.password = hashedPassword;
  await admin.save();

  return { message: RESPONSE_MESSAGES.PASSWORD_RESET_SUCCESS };
};

module.exports = {
  registerAdmin,
  verifyRegistrationOtp,
  loginAdminStep1,
  verifyLoginOtp,
  sendResetPasswordOtp,
  verifyResetPasswordOtp,
  resetPassword,
};

