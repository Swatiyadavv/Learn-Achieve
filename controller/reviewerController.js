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

// const updateQuestion = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedData = {
//       ...req.body,
//       reviewStatus: 'edited',
//       updatedBy: req.user?.email || 'system'
//     };

//     const question = await Question.findByIdAndUpdate(id, updatedData, { new: true });

//     if (!question) return errorResponse(res, 'Question not found', 404);

//     return successResponse(res, 'Question updated successfully', question);
//   } catch (err) {
//     console.error(err);
//     return errorResponse(res, 'Internal server error', 500);
//   }
// };


const SubQuestion = require("../model/subQuestionModel");

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // parent update
    const updatedData = {
      ...req.body,
      reviewStatus: "edited",
      updatedBy: req.user?.email || "system",
    };

    // Remove subQuestions from parent update data (kyunki woh alag collection me hain)
    const subQuestions = updatedData.subQuestions || [];
    delete updatedData.subQuestions;

    // Update parent
    const question = await Question.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!question) return errorResponse(res, "Question not found", 404);

    // Update subquestions if provided
    if (subQuestions.length > 0) {
      for (const subQ of subQuestions) {
        if (subQ._id) {
          // update existing subquestion
          await SubQuestion.findByIdAndUpdate(
            subQ._id,
            {
              questionText: subQ.questionText,
              options: subQ.options,
              correctAnswer: subQ.correctAnswer,
            },
            { new: true }
          );
        } else {
          // add new subquestion
          await SubQuestion.create({
            parentId: id,
            questionText: subQ.questionText,
            options: subQ.options,
            correctAnswer: subQ.correctAnswer,
          });
        }
      }
    }

    // fetch updated subquestions
    const updatedSubs = await SubQuestion.find({ parentId: id });

    return successResponse(res, "Question updated successfully", {
      ...question.toObject(),
      subQuestions: updatedSubs,
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal server error", 500);
  }
};
const approveQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewStatus } = req.body; // status frontend se aayega

    if (!reviewStatus) {
      return errorResponse(res, 'reviewStatus is required in request body', 400);
    }

    const question = await Question.findByIdAndUpdate(
      id,
      { reviewStatus },
      { new: true }
    );

    if (!question) return errorResponse(res, 'Question not found', 404);

    return successResponse(res, `Question ${reviewStatus} successfully`, question);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Internal server error', 500);
  }
};



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

    const data = await reviewerService.getAllReviewHistory(filters);

    return successResponse(res, "Review history fetched successfully", {
      total: data.total,
      data: data.questions
    });
  } catch (error) {
    console.error("Error in getReviewHistory:", error);
    return errorResponse(res, "Internal server error", 500);
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

module.exports = {
  getReviewQuestions,
  updateQuestion,
  deleteQuestion,
  approveQuestion,
  getReviewHistory
};
