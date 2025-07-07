const Joi = require("joi");

exports.validateMainQuestion = Joi.object({
  id: Joi.string().optional(),
  classId: Joi.string().required(),
  subjectId: Joi.string().required(),
  medium: Joi.string().valid("Hindi", "English", "Semi-English", "Marathi").required(),
  module: Joi.string().required(),
  topicName: Joi.string().required(),
  typeOfQuestion: Joi.string().valid("General", "Comprehensive", "Poem").required(),
  questionType: Joi.string().valid("Question Bank", "SAT Exam").required(),
});

exports.validateSubQuestion = Joi.object({
  parentId: Joi.string().required(),
  questionText: Joi.string().required(),
  options: Joi.array().items(Joi.string()).min(2).max(5).required(),
  correctAnswer: Joi.string().required(),
});
