const express = require('express');
const router = express.Router();
const reviewerController = require('../controller/reviewerController');

// GET /api/reviewers/questions?classId=xxx&subjectId=xxx&medium=English
router.get('/questions', reviewerController.getReviewQuestions);

module.exports = router;
