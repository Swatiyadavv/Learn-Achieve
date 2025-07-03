const express = require("express");
const router = express.Router();
const questionBankController = require("../controller/questionController");
router.post("/add", questionBankController.addOrUpdateQuestionBank);
module.exports = router;
