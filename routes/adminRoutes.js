const express = require("express");
const router = express.Router();

const { register, login } = require("../controller/adminController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/dashboard", protect, (req, res) => {
  res.json({ message: "Welcome Admin", admin: req.admin });
});

module.exports = router;
