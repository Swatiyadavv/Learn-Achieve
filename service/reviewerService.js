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

module.exports = { getQuestions };
 