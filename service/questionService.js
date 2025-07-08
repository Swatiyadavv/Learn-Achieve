const QuestionBank = require("../model/questionModel");
require("../model/classMasterModel");
require("../model/subjectModel");
const SubQuestion = require("../model/subQuestionModel")
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

exports.createOrUpdateQuestionBank = async (data) => {
  const {
    id,
    classId,
    subjectId,
    medium,
    module,
    topicName,
    typeOfQuestion,
    questionType,
  } = data;

  const cleanModule = module.trim();
  const cleanTopic = topicName.trim();

  if (id) {
    // Update flow
    const updated = await QuestionBank.findById(id);
    if (!updated) throw new Error("Question not found");

    updated.classId = classId;
    updated.subjectId = subjectId;
    updated.medium = medium;
    updated.module = cleanModule;
    updated.topicName = cleanTopic;
    updated.typeOfQuestion = typeOfQuestion;
    updated.questionType = questionType;

    await updated.save(); //  Explicit save
    return updated;
  } else {
    // Duplicate check
    const exists = await QuestionBank.findOne({
      classId,
      subjectId,
      medium,
      module: cleanModule,
      topicName: cleanTopic,
      typeOfQuestion,
      questionType,
    });

    if (exists) {
      throw new Error("This Question Bank entry already exists.");
    }

    // Create new + save
    const question = new QuestionBank({
      classId,
      subjectId,
      medium,
      module: cleanModule,
      topicName: cleanTopic,
      typeOfQuestion,
      questionType,
    });

    await question.save(); // 
    return question;
  }
};

exports.addSubQuestion = async (data) => {
  const { parentId, questionText, options, correctAnswer } = data;

  const trimmedQuestion = questionText.trim();
  const trimmedOptions = options.map(opt => opt.trim());
  const trimmedAnswer = correctAnswer.trim();

  // Duplicate check
  const duplicate = await SubQuestion.findOne({
    parentId,
    questionText: trimmedQuestion,
    correctAnswer: trimmedAnswer,
    options: trimmedOptions,
  });

  if (duplicate) throw new Error("Subquestion already exists under this parent.");

  const subQuestion = new SubQuestion({
    parentId,
    questionText: trimmedQuestion,
    options: trimmedOptions,
    correctAnswer: trimmedAnswer,
  });

  await subQuestion.save(); 
  return subQuestion;
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