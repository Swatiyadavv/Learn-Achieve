const Joi = require("joi");

exports.blogCategorySchema = Joi.object({
  categoryName: Joi.string().trim().min(3).max(50).required(),
  isActive: Joi.boolean().optional()
});
