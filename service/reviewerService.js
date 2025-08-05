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

const getQuestions = async ({ classId, subjectId, medium }) => {
  const query = {};
  if (classId) query.classId = classId;
  if (subjectId) query.subjectId = subjectId;
  if (medium) query.medium = medium;

  return await Question.find(query)
    .populate('classId', 'name')
    .populate('subjectId', 'name');
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
