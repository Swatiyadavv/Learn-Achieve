const express = require("express");
const router = express.Router();
const questionBankController = require("../controller/questionController");


// Parent Question API
router.post("/question", questionBankController.createOrUpdateQuestionBank);

// Subquestion APIs
router.post("/subquestion", questionBankController.addSubQuestion);
router.get("/subquestion/:parentId", questionBankController.getSubQuestions);
router.delete("/subquestion/:id", questionBankController.deleteSubQuestion);

module.exports = router;

// filter by class,subject,medium, get all , search , pagination
router.get("/filter", questionBankController.getFilteredQuestionBank);
// status update 
router.put('/status/:id',questionBankController.changeStatus);
//delete single , multiple
router.delete('/delete', questionBankController.deleteSubjectSmart);
module.exports = router;
