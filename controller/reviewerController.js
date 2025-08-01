const reviewerService = require('../service/reviewerService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getReviewQuestions = async (req, res) => {
  try {
    const { classId, subjectId, medium } = req.query;

    if (!classId && !subjectId && !medium) {
      return errorResponse(res, 'Please provide at least one filter', 400);
    }

    const questions = await reviewerService.getQuestions({ classId, subjectId, medium });

    return successResponse(res, 'Questions fetched successfully', questions);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Internal server error');
  }
};

module.exports = { getReviewQuestions };
