const studentService = require("../service/studentService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Student = require("../model/studentModel");
const OTP = require("../model/otpModel");
const generateOtp = require("../utils/generateOtp");
const sendOtpEmail = require("../utils/sendOtpEmail");

// ✅ Add Personal Details
exports.addPersonalDetails = async (req, res) => {
  try {
    const result = await studentService.addPersonalDetails(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// In studentController.js

exports.addStudentDetails = async (req, res) => {
  try {
    const result = await studentService.addStudentDetails(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// ✅ Add Contact Details
exports.addContactDetails = async (req, res) => {
  try {
    const result = await studentService.addContactDetails(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Verify OTP and Register
exports.verifyOtpAndRegister = async (req, res) => {
  try {
    const { pendingStudentId, otp } = req.body;
    const result = await studentService.verifyOtpAndRegister(pendingStudentId, otp);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Login Student
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await studentService.loginStudent(email, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

// ✅ Request OTP for Login
exports.requestLoginOtp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const message = await studentService.requestLoginOtp(email, password);
    res.status(200).json({ message });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

// ✅ Verify OTP for Login
exports.verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await studentService.verifyLoginOtp(email, otp);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};





