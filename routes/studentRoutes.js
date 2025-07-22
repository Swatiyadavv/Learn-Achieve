const express = require("express");
const router = express.Router();
const studentController = require("../controller/studentController");

// router.post("/register", studentController.addPersonalDetails);
router.post("/register", studentController.addStudentDetails);
// router.post("/contact", studentController.addContactDetails);
router.post("/verify", studentController.verifyOtpAndRegister);

//login
router.post("/login", studentController.requestLoginOtp);
router.post("/login/verify", studentController.verifyLoginOtp);




module.exports = router;
