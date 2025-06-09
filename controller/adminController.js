const adminService = require("../service/adminService");

const register = async (req, res) => {
  try {
    const result = await adminService.registerAdmin(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const verifyRegistrationOtp = async (req, res) => {
  try {
    const result = await adminService.verifyRegistrationOtp(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const loginStep1 = async (req, res) => {
  try {
    const result = await adminService.loginAdminStep1(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const verifyLoginOtp = async (req, res) => {
  try {
    const result = await adminService.verifyLoginOtp(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const sendResetOtp = async (req, res) => {
  try {
    const result = await adminService.sendResetPasswordOtp(req.body.email);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const verifyResetOtp = async (req, res) => {
  try {
    const result = await adminService.verifyResetPasswordOtp(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await adminService.resetPassword(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  register,
  verifyRegistrationOtp,
  loginStep1,
  verifyLoginOtp,
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
};
