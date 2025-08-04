const express = require('express');
const router = express.Router();
const reviewerController = require('../controller/reviewerController');

// GET /api/reviewers/questions?classId=xxx&subjectId=xxx&medium=English
router.get('/questions', reviewerController.getReviewQuestions);


// PUT (Update)
router.put('/questions/:id', reviewerController.updateQuestion);

// DELETE
router.delete('/questions/:id', reviewerController.deleteQuestion);
module.exports = router;
