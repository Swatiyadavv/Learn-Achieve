const userService = require("../service/userService");

exports.register = async (req, res) => {
  try {
    const result = await userService.registerUser(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.verifyRegistration = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const result = await userService.verifyRegistrationOtp(token, req.body.otp);
    res.json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};


exports.loginStep1 = async (req, res) => {
  try {
    const result = await userService.loginStep1(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.verifyLogin = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const result = await userService.verifyLoginOtp(token, req.body.otp);
    res.json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

