const express = require('express');
const router = express.Router();
const reviewerController = require('../controller/reviewerController');

// GET /api/reviewers/questions?classId=xxx&subjectId=xxx&medium=English
router.get('/questions', reviewerController.getReviewQuestions);


// PUT (Update)
router.put('/questions/:id', reviewerController.updateQuestion);

// Approve a question
router.put('/questions/approve/:id', reviewerController.approveQuestion);

// Full review history with all filters and updatedBy email
router.get('/questions/history', reviewerController.getReviewHistory);

// DELETE
// router.delete('/questions/:id', reviewerController.deleteQuestion);

// Multiple delete
router.delete('/questions', reviewerController.deleteMultipleQuestions);

module.exports = router;
 
