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

// const Question = require('../model/questionModel');
const SubQuestion = require('../model/subQuestionModel'); // import this

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

const getAllReviewHistory = async (filters = {}) => {
  const query = {};

  if (filters.classId) query.classId = filters.classId;
  if (filters.subjectId) query.subjectId = filters.subjectId;
  if (filters.medium) query.medium = filters.medium;
  if (filters.status) query.status = filters.status;

  if (filters.from || filters.to) {
    query.createdAt = {};
    if (filters.from) query.createdAt.$gte = new Date(filters.from);
    if (filters.to) query.createdAt.$lte = new Date(filters.to);
  }

  const total = await Question.countDocuments(query);

  const questions = await Question.find(query)
    .populate('classId', 'class')
    .populate('subjectId', 'subject')
    .sort({ createdAt: -1 })
    .skip(filters.offset)
    .limit(filters.limit);

  return { total, questions };
};

module.exports = {
  getQuestions,
  getAllReviewHistory
};
