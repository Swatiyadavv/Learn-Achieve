const express = require("express");
const router = express.Router();
const studentController = require("../controller/studentController");

// User-side student APIs
router.post("/register", studentController.registerStudent);
router.post("/verify", studentController.verifyStudentOTP);
router.post("/login", studentController.loginRequestStudent);
router.post("/login/verify", studentController.loginVerifyStudent);

// Admin-side student APIs
router.get("/all", studentController.getAllStudents);
router.get("/date-range", studentController.getStudentsByDate);
router.get("/paginated", studentController.getStudentsPaginate);
router.get("/earnings", studentController.getStudentEarnings);

module.exports = router;
