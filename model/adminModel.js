const mongoose = require("mongoose");
const ADMIN_ROLE = require("../enums/adminRoleEnum");

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(ADMIN_ROLE), default: ADMIN_ROLE.ADMIN },
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
