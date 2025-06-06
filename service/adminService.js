const Admin = require("../model/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ADMIN_ROLE = require("../enums/adminRoleEnum");
const RESPONSE_MESSAGES = require("../enums/responseMessageEnum");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const registerAdmin = async ({ email, password }) => {
  const existing = await Admin.findOne({ email });
  if (existing) {
    throw new Error(RESPONSE_MESSAGES.ADMIN_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ email, password: hashedPassword, role: ADMIN_ROLE.ADMIN });
  return { message: RESPONSE_MESSAGES.ADMIN_REGISTERED, adminId: admin._id };
};

const loginAdmin = async ({ email, password }) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error(RESPONSE_MESSAGES.ADMIN_NOT_FOUND);
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
  }

  const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: "1d" });
  return { token };
};

module.exports = {
  registerAdmin,
  loginAdmin,
};
