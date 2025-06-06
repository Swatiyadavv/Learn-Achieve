const adminService = require("../service/adminService");

const register = async (req, res) => {
  try {
    const result = await adminService.registerAdmin(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await adminService.loginAdmin(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { register, login };
