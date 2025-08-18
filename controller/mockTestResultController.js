
const { submitMockTestService } = require('../service/mockTestResultService');
const UserMockTestResult = require('../model/userMockTestResultModel');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// exports.submitMockTest = async (req, res) => {
//   try {
//     const userId = req.user.id; // from token
//     const { mockTestId, packageId, answers } = req.body;

//     const result = await submitMockTestService({ userId, mockTestId, packageId, answers });

//     return successResponse(res, 'Mock test submitted successfully', result);
//   } catch (err) {
//     console.error(err);
//     return errorResponse(res, 'Submission failed');
//   }
// };
exports.submitMockTest = async (req, res) => {
  try {
    const userId = req.user.id; // from token
    const { mockTestId, packageId, answers } = req.body;

    const result = await submitMockTestService({ userId, mockTestId, packageId, answers });

    return successResponse(res, 'Mock test submitted successfully', result);
  } catch (err) {
    console.error(err);
    return errorResponse(res, err.message || 'Submission failed', 400);
  }
};

// exports.getMockTestResult = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { mockTestId } = req.params;

//     const result = await UserMockTestResult.findOne({ userId, mockTestId })
//       .populate('responses.questionId', 'questionText options')
//       .lean();

//     if (!result) return errorResponse(res, 'Result not found', 404);

//     return successResponse(res, 'Mock test result fetched', result);
//   } catch (err) {
//     console.error(err);
//     return errorResponse(res, 'Error fetching result');
//   }
// };

exports.getMockTestResult = async (req, res) => {
  try {
    const { mockTestId } = req.params;
    const userId = req.user.id;

    // ✅ include mockTestId in query
  const result = await UserMockTestResult.findOne({ userId, mockTestId })
  .populate({
    path: "mockTestId",
    model: "MockTest", // ✅ explicitly set model
    select: "mockTestName duration subjects totalQuestions"
  })
  .populate({
    path: "responses.questionId",
    model: "QuestionBank", // ✅ explicitly set model
    select: "questionText correctAnswer subjectId",
    populate: {
      path: "subjectId",
      model: "Subject", // ✅ explicitly set model
      select: "name"
    }
  })
  .lean();


    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    // ✅ Subject-wise aggregation
    const subjectsMap = {};
    result.responses.forEach(r => {
      if (!r.questionId) return;

      const subjId = r.questionId.subjectId?._id?.toString();
      if (!subjId) return;

      if (!subjectsMap[subjId]) {
        subjectsMap[subjId] = {
          subjectId: subjId,
          subjectName: r.questionId.subjectId?.name || "Unknown",
          attemptedQuestions: 0,
          correctQuestions: 0,
          incorrectQuestions: 0,
          unattemptedQuestions: 0,
          totalQuestions: 0,
          score: 0,
        };
      }

      subjectsMap[subjId].totalQuestions++;
      if (r.selectedOption) {
        subjectsMap[subjId].attemptedQuestions++;
        if (r.isCorrect) {
          subjectsMap[subjId].correctQuestions++;
          subjectsMap[subjId].score += 1;
        } else {
          subjectsMap[subjId].incorrectQuestions++;
          subjectsMap[subjId].score -= 0.5;
        }
      } else {
        subjectsMap[subjId].unattemptedQuestions++;
      }
    });

    // ✅ Final Response
    const responseData = {
      mockTestId: result.mockTestId?._id || null,
      mockTestName: result.mockTestId?.mockTestName || "Unknown",   // ✅ fixed
      duration: result.mockTestId?.duration || 0,                   // ✅ fixed
      attemptNumber: result.attemptNumber,
      attempted: result.attempted,
      correct: result.correct,
      wrong: result.wrong,
      unattempted: result.unattempted,
      totalMarks: result.totalMarks,
      subjects: Object.values(subjectsMap),
      questions: result.responses.map(r => ({
        questionId: r.questionId?._id || null,
        questionText: r.questionId?.questionText || "N/A",
        selectedOption: r.selectedOption || null,
        correctAnswer: r.questionId?.correctAnswer || null,
        subjectId: r.questionId?.subjectId?._id || null,
        subjectName: r.questionId?.subjectId?.name || "Unknown",
        isCorrect: r.isCorrect
      }))
    };

    return res.status(200).json({ message: "Success", data: responseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
