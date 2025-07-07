const express = require("express");
const router = express.Router();
const questionBankController = require("../controller/questionController");


// Parent Question API
router.post("/", questionBankController.createOrUpdateQuestionBank);

// Subquestion APIs
router.post("/subquestion", questionBankController.addSubQuestion);
router.get("/subquestion/:parentId", questionBankController.getSubQuestions);
router.delete("/subquestion/:id", questionBankController.deleteSubQuestion);

// filter by class,subject,medium, get all , search , pagination
router.get("/filter", questionBankController.getFilteredQuestionBank);
// status update 
router.put('/status/:id',questionBankController.changeStatus);
//delete single , multiple
router.delete('/delete', questionBankController.deleteSubjectSmart);
module.exports = router;
