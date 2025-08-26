// const Question = require('../model/questionModel');

// const getQuestions = async ({ classId, subjectId, medium }) => {
//   const query = {};

//   if (classId) query.classId = classId;
//   if (subjectId) query.subjectId = subjectId;
//   if (medium) query.medium = medium;

//   return await Question.find(query)
//     .populate('classId', 'name')
//     .populate('subjectId', 'name');
// };

// const getAllReviewHistory = async (filters = {}) => {
//   const query = {};

//   if (filters.classId) query.classId = filters.classId;
//   if (filters.subjectId) query.subjectId = filters.subjectId;
//   if (filters.medium) query.medium = filters.medium;
//   if (filters.status) query.status = filters.status;

//   if (filters.from || filters.to) {
//     query.createdAt = {};
//     if (filters.from) query.createdAt.$gte = new Date(filters.from);
//     if (filters.to) query.createdAt.$lte = new Date(filters.to);
//   }

//   const total = await Question.countDocuments(query);

//   const questions = await Question.find(query)
//     .populate('classId', 'class')
//     .populate('subjectId', 'subject')
//     .sort({ createdAt: -1 })
//     .skip(filters.offset)
//     .limit(filters.limit);

//   return { total, questions };
// };



// module.exports = { getQuestions,getAllReviewHistory };
 const Question = require('../model/questionModel');
const QuestionBank = require("../model/questionModel"); 

// const Question = require('../model/questionModel');
const SubQuestion = require('../model/subQuestionModel'); // import this
const reviewStatus = require("../model/questionModel");

const getQuestions = async (filters) => {
  const query = {};
  if (filters.classId) query.classId = filters.classId;
  if (filters.subjectId) query.subjectId = filters.subjectId;
  if (filters.medium) query.medium = filters.medium;

  const questions = await Question.find(query)
    .populate('classId', '_id className')
    .populate('subjectId', '_id subjectName');

  const result = [];

  for (const q of questions) {
    let formattedQuestion = { ...q._doc };

    // If Poem/Paragraph, fetch subquestions
    if (q.typeOfQuestion === 'Poem' || q.typeOfQuestion === 'Paragraph') {
      const subQs = await SubQuestion.find({ parentId: q._id });

      formattedQuestion.subQuestions = subQs.map((subQ) => ({
        _id: subQ._id, 
        questionText: subQ.questionText,
        options: subQ.options,
        correctAnswer: subQ.correctAnswer
      }));

      formattedQuestion.options = []; // so frontend doesn’t expect main options
    } else {
      // Make sure options array always exists
      formattedQuestion.options = q.options?.length ? q.options : [];
    }

    result.push(formattedQuestion);
  }

  return result;
};

// const getAllReviewHistory = async (filters = {}) => {
//   const query = {};

//   if (filters.classId) query.classId = filters.classId;
//   if (filters.subjectId) query.subjectId = filters.subjectId;
//   if (filters.medium) query.medium = filters.medium;
//   if (filters.status) query.status = filters.status;

//   if (filters.from || filters.to) {
//     query.createdAt = {};
//     if (filters.from) query.createdAt.$gte = new Date(filters.from);
//     if (filters.to) query.createdAt.$lte = new Date(filters.to);
//   }

//   const total = await Question.countDocuments(query);

//   const questions = await Question.find(query)
//     .populate('classId', 'class')
//     .populate('subjectId', 'subject')
//     .sort({ createdAt: -1 })
//     .skip(filters.offset)
//     .limit(filters.limit);

//   return { total, questions };
// };
// service/reviewerService.js

// const getAllReviewHistory = async (filters = {}) => {
//   try {
//     let query = {};

//     // 🔹 Class filter
//     if (filters.classId) {
//       query.classId = filters.classId;
//     }

//     // 🔹 Subject filter
//     if (filters.subjectId) {
//       query.subjectId = filters.subjectId;
//     }

//     // 🔹 Medium filter
//     if (filters.medium) {
//       query.medium = filters.medium;
//     }

//     // 🔹 Review Status filter (approved / edited / multiple)
//     if (filters.reviewStatus) {
//       if (typeof filters.reviewStatus === "string" && filters.reviewStatus.includes(",")) {
//         // agar comma separated hai => ?reviewStatus=approved,edited
//         query.reviewStatus = { $in: filters.reviewStatus.split(",") };
//       } else if (Array.isArray(filters.reviewStatus)) {
//         query.reviewStatus = { $in: filters.reviewStatus };
//       } else {
//         query.reviewStatus = filters.reviewStatus;
//       }
//     }

//     // 🔹 Date range filter
//     if (filters.from && filters.to) {
//       query.createdAt = {
//         $gte: new Date(filters.from + "T00:00:00.000Z"), // day start
//         $lte: new Date(filters.to + "T23:59:59.999Z"),   // day end
//       };
//     }

//     // 🔹 Count total matching records
//     const total = await reviewStatus.countDocuments(query);

//     // 🔹 Fetch paginated data
//     const questions = await reviewStatus.find(query)
//       .skip(filters.offset || 0)
//       .limit(filters.limit || 10)
//       .sort({ createdAt: -1 });

//     return { total, questions };
//   } catch (error) {
//     console.error("Service error in getAllReviewHistory:", error);
//     throw error;
//   }
// };
const getAllReviewHistory = async (filters) => {
  let query = {};

  if (filters.classId) query.classId = filters.classId;
  if (filters.subjectId) query.subjectId = filters.subjectId;
  if (filters.medium) query.medium = filters.medium;
  if (filters.reviewStatus) query.reviewStatus = filters.reviewStatus;

  if (filters.from && filters.to) {
    query.updatedAt = { $gte: new Date(filters.from), $lte: new Date(filters.to) };
  }

  const questions = await QuestionBank.find(query)
    .populate("classId", "class")     // ✅ ClassMaster ka sirf name field
    .populate("subjectId", "subject")   // ✅ Subject ka sirf name field
    .skip(filters.offset)
    .limit(filters.limit)
    .lean();

  const total = await QuestionBank.countDocuments(query);

  // response ko format karna taaki name null na aaye
  const formattedQuestions = questions.map(q => ({
    ...q,
    className: q.classId?.class || null,
    classId: q.classId?._id || q.classId,
    subjectName: q.subjectId?.subject || null,
    subjectId: q.subjectId?._id || q.subjectId,
  }));

  return { total, questions: formattedQuestions };
};

module.exports = {
  getQuestions,
  getAllReviewHistory
};
