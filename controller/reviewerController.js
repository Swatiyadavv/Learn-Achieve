const reviewerService = require('../service/reviewerService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const Question = require('../model/questionModel');

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


const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = {
      ...req.body,
      reviewStatus: 'edited' // always set to edited on update
    };

    const question = await Question.findByIdAndUpdate(id, updatedData, { new: true });

    if (!question) {
      return errorResponse(res, 'Question not found', 404);
    }

    return successResponse(res, 'Question updated successfully', question);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

const approveQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndUpdate(
      id,
      { reviewStatus: 'approved' },
      { new: true }
    );

    if (!question) {
      return errorResponse(res, 'Question not found', 404);
    }

    return successResponse(res, 'Question approved successfully', question);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return errorResponse(res, 'Question not found', 404);
    }

    return successResponse(res, 'Question deleted successfully');
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Internal server error', 500);
  } 

};


module.exports = { getReviewQuestions ,updateQuestion,deleteQuestion,approveQuestion};
