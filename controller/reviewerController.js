const reviewerService = require('../service/reviewerService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const Question = require('../model/questionModel');
const questionService = require("../service/reviewerService");


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
      reviewStatus: 'edited',
      updatedBy: req.user?.email || 'system' // inject the logged-in email
    };

    const question = await Question.findByIdAndUpdate(id, updatedData, { new: true });

    if (!question) return errorResponse(res, 'Question not found', 404);

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
      {
        reviewStatus: 'approved',
        updatedBy: req.user?.email || 'system'
      },
      { new: true }
    );

    if (!question) return errorResponse(res, 'Question not found', 404);

    return successResponse(res, 'Question approved successfully', question);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Internal server error', 500);
  }
};



// const questionService = require("../services/questionService");

const getReviewHistory = async (req, res) => {
  try {
    const filters = {
      classId: req.query.classId,
      subjectId: req.query.subjectId,
      medium: req.query.medium,
      status: req.query.status,
      from: req.query.from,
      to: req.query.to,
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0
    };

    const data = await questionService.getAllReviewHistory(filters);

    res.status(200).json({
      success: true,
      message: "Review history fetched successfully",
      total: data.total,
      data: data.questions
    });
  } catch (error) {
    console.error("Error in getReviewHistory:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// module.exports = { getReviewHistory };



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


module.exports = { getReviewQuestions ,updateQuestion,deleteQuestion,approveQuestion,getReviewHistory};
