const express = require("express");
const router = express.Router();
const controller = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");

//registration
router.post("/register", controller.register);
router.post("/verify-registration", protect,controller.verifyRegistration);

//login
router.post("/login", controller.loginStep1);
router.post("/verify-login", controller.verifyLogin);

module.exports = router;
