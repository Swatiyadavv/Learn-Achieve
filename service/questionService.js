const QuestionBank = require("../model/questionModel");
require("../model/classMasterModel");
require("../model/subjectModel");
const SubQuestion = require("../model/subQuestionModel")

exports.createOrUpdateQuestionBank = async (data) => {
  const {
    id, classId, subjectId, medium, module,
    topicName, typeOfQuestion, questionType,
    questionText, options, correctAnswer
  } = data;

  const cleanModule = module.trim();
  const cleanTopic = topicName.trim();

  if (id) {
    const updated = await QuestionBank.findById(id);
    if (!updated) throw new Error("Question not found");

    updated.classId = classId;
    updated.subjectId = subjectId;
    updated.medium = medium;
    updated.module = cleanModule;
    updated.topicName = cleanTopic;
    updated.typeOfQuestion = typeOfQuestion;
    updated.questionType = questionType;

    if (typeOfQuestion === "General") {
      updated.questionText = questionText.trim();
      updated.options = options.map(opt => opt.trim());
      updated.correctAnswer = correctAnswer.trim();
    } else {
      // Clear general fields
      updated.questionText = null;
      updated.options = [];
      updated.correctAnswer = null;
    }

    await updated.save();
    return updated;
  }

  const exists = await QuestionBank.findOne({
    classId, subjectId, medium,
    module: cleanModule, topicName: cleanTopic,
    typeOfQuestion, questionType
  });
  if (exists) throw new Error("This Question Bank entry already exists.");

  const question = new QuestionBank({
    classId, subjectId, medium,
    module: cleanModule, topicName: cleanTopic,
    typeOfQuestion, questionType
  });

  if (typeOfQuestion === "General") {
    if (!questionText || !options || options.length !== 4 || !correctAnswer)
      throw new Error("General question must have text, 4 options, and correct answer.");
    question.questionText = questionText.trim();
    question.options = options.map(opt => opt.trim());
    question.correctAnswer = correctAnswer.trim();
  }

  await question.save();
  return question;
};

exports.addSubQuestion = async (data) => {
  const { parentId, questionText, options, correctAnswer } = data;

  if (!questionText || options.length !== 4 || !correctAnswer) {
    throw new Error("Subquestion must have question, 4 options, and correct answer.");
  }

  const subQuestion = new SubQuestion({
    parentId,
    questionText: questionText.trim(),
    options: options.map(opt => opt.trim()),
    correctAnswer: correctAnswer.trim()
  });
  await subQuestion.save();
  return subQuestion;
};


exports.getFilteredQuestionBank = async (queryParams) => {
  const { query = "", limit = 10, offset = 0 } = queryParams;
  const searchRegex = new RegExp(query, "i");

  const filter = {
    topicName: { $regex: searchRegex },
  };

  const [questions, total] = await Promise.all([
    QuestionBank.find(filter)
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    QuestionBank.countDocuments(filter),
  ]);

  return {
    total,
    limit: parseInt(limit),
    offset: parseInt(offset),
    questions,
  };
};
exports.getSubQuestions = async (parentId) => {
  return await SubQuestion.find({ parentId }).sort({ createdAt: -1 });
};


exports.deleteSubQuestion = async (id) => {
  const sub = await SubQuestion.findById(id);
  if (!sub) throw new Error("Subquestion not found");

  await SubQuestion.findByIdAndDelete(id);
  return true;
};

exports.updateStatus =async (id, status) => {
  if (!['active', 'inactive'].includes(status)) {
    throw new Error('Invalid status');
  }

  const question = await QuestionBank.findById(id);
  if (!question) throw new Error('question not found');

  if (question.status === status) {
    throw new Error(`question is already ${status}`);
  }

  question.status = status;
  await question.save();

  return question;
};




exports.deleteSubject= async (id) => {
    const question = await QuestionBank.findById(id);
    if (!question) throw new Error('question not found');

    if (question.image) {
      const imagePath = path.resolve(question.image);
      fs.unlink(imagePath, err => {
        if (err) console.error('Image delete error:', err.message);
      });
    }

    await QuestionBank.findByIdAndDelete(id);
  };

  exports.deleteMultiple= async (ids) => {
    const questions = await QuestionBank.find({ _id: { $in: ids } });

    for (const question of questions) {
      if (question.image) {
        const imagePath = path.resolve(question.image);
        fs.unlink(imagePath, err => {
          if (err) console.error('Failed to delete image:', err);
        });
      }
    }
await QuestionBank.deleteMany({ _id: { $in: ids } });
  };