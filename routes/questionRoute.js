const express = require("express");
const router = express.Router();
const questionBankController = require("../controller/questionController");
//add or update
router.post("/add", questionBankController.addOrUpdateQuestionBank);
// filter by class,subject,medium, get all , search , pagination
router.get("/filter", questionBankController.getFilteredQuestionBank);
// status update 
router.put('/status/:id',questionBankController.changeStatus);
//delete single , multiple
router.delete('/delete', questionBankController.deleteSubjectSmart);
module.exports = router;
