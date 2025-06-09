const express = require("express");
const router = express.Router();

const adminController = require("../controller/adminController");
const { protect } = require("../middleware/authMiddleware");

// Registration + OTP verify
router.post("/register", adminController.register);
router.post("/verify-registration-otp", adminController.verifyRegistrationOtp);

// Login step 1 and 2 (OTP verify)
router.post("/login", adminController.loginStep1);
router.post("/verify-login-otp", adminController.verifyLoginOtp);

// Password reset
router.post("/send-reset-otp", adminController.sendResetOtp);
router.post("/verify-reset-otp", adminController.verifyResetOtp);
router.post("/reset-password", adminController.resetPassword);

// Protected admin dashboard example
router.get("/dashboard", protect, (req, res) => {
  res.json({ message: "Welcome Admin", admin: req.admin });
});

module.exports = router;


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDY2YjBiNTg2YTIyNzViNGU1Y2VjOCIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0OTQ0NTgwMywiZXhwIjoxNzQ5NTMyMjAzfQ.yIFME-hhvfnQ-LQUFtjNEIpJlV08Wuf-OPqUy0gvoWY
