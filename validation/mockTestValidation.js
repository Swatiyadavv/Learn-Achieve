const Joi = require("joi");

const mockTestValidation = Joi.object({
  mockTestName: Joi.string().min(3).max(100).required(),
  medium: Joi.array().items(Joi.string()).min(1).required(),
  class: Joi.array().items(Joi.string()).min(1).required(),
  duration: Joi.number().min(1).max(300).required(),
  subjects: Joi.array().items(Joi.string()).min(1).required(),
  totalQuestions: Joi.number().min(1).max(500).required()
});

module.exports = { mockTestValidation };