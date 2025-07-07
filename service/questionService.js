const QuestionBank = require("../model/questionModel");
require("../model/classMasterModel");
require("../model/subjectModel");
const SubQuestion = require("../model/subQuestionModel")
const QuestionBank = require("../model/questionModel");
const SubQuestion = require("../model/subQuestionModel");

//  Create or Update Main Question
exports.createOrUpdateQuestionBank = async (data) => {
  const {
    id,
    classId,
    subjectId,
    medium,
    module,
    topicName,
    typeOfQuestion,
    questionType
  } = data;

  //  Trim inputs
  const cleanModule = module.trim();
  const cleanTopic = topicName.trim();

  if (id) {
    //  Update
    const updated = await QuestionBank.findByIdAndUpdate(
      id,
      {
        classId,
        subjectId,
        medium,
        module: cleanModule,
        topicName: cleanTopic,
        typeOfQuestion,
        questionType,
      },
      { new: true }
    );

    if (!updated) throw new Error("Question not found");
    return updated;
  } else {
    //  Duplicate check before creating
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

    //  Create new
    return await QuestionBank.create({
      classId,
      subjectId,
      medium,
      module: cleanModule,
      topicName: cleanTopic,
      typeOfQuestion,
      questionType,
    });
  }
};
exports.addSubQuestion = async (data) => {
  const { parentId, questionText, options, correctAnswer } = data;

  const trimmedQuestion = questionText.trim();
  const trimmedOptions = options.map(opt => opt.trim());
  const trimmedAnswer = correctAnswer.trim();

  //  Check duplicate subquestion under same parent
  const duplicate = await SubQuestion.findOne({
    parentId,
    questionText: trimmedQuestion,
    correctAnswer: trimmedAnswer,
    options: trimmedOptions,
  });

  if (duplicate) throw new Error("Subquestion already exists under this parent.");

  return await SubQuestion.create({
    parentId,
    questionText: trimmedQuestion,
    options: trimmedOptions,
    correctAnswer: trimmedAnswer,
  });
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