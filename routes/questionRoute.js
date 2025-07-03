const express = require("express");
const router = express.Router();
const questionBankController = require("../controller/questionController");
router.post("/add", questionBankController.addOrUpdateQuestionBank);
router.get("/filter", questionBankController.getFilteredQuestionBank);
module.exports = router;
