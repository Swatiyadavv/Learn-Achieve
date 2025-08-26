const express = require("express");
const router = express.Router();
const studentController = require("../controller/studentController");
const { verifyUserToken } = require("../middleware/userAuth"); // JWT middleware
const { uploadCheque } = require("../middleware/uploadBankMiddle");


// User-side student APIs
router.post("/register", studentController.registerStudent);
router.post("/verify", studentController.verifyStudentOTP);
router.post("/login", studentController.loginRequestStudent);
router.post("/login/verify", studentController.loginVerifyStudent);



// Student request banayega
router.post("/", verifyUserToken ,studentController.createWithdrawal);
router.get("/status", verifyUserToken, studentController.getWithdrawalRequests);



// Single universal API get all serach pagination 
router.get("/students", studentController.getStudents);


// router.get("/earnings", studentController.getStudentEarnings);
router.get("/earnings", verifyUserToken,studentController.getStudentEarnings);

module.exports = router;


// Simple route now
router.post("/bank", uploadCheque,verifyUserToken, studentController.addOrUpdateBankDetails);

router.route("/").get(verifyUserToken, studentController.getBankDetails)


module.exports = router;
