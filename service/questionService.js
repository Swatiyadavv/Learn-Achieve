const QuestionBank = require("../model/questionModel");
require("../model/classMasterModel");
require("../model/subjectModel");
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

  if (id) {
    // Update existing record
    const updated = await QuestionBank.findByIdAndUpdate(
      id,
      { classId, subjectId, medium, module, topicName, typeOfQuestion, questionType },
      { new: true }
    );
    if (!updated) throw new Error("QuestionBank entry not found.");
    return updated;
  } else {
    // Check for duplicate
    const exists = await QuestionBank.findOne({
      classId,
      subjectId,
      medium,
      module,
      topicName,
      typeOfQuestion,
      questionType,
    });

    if (exists) throw new Error("This Question Bank entry already exists.");

    return await QuestionBank.create({
      classId,
      subjectId,
      medium,
      module,
      topicName,
      typeOfQuestion,
      questionType,
    });
  }
};

exports.getFilteredQuestionBank = async (query) => {
  const {
    classId,
    subjectId,
    medium,
    typeOfQuestion,
    questionType,
    search,
    limit = 10,
    offset = 0,
  } = query;

  const filter = {};

  if (classId) filter.classId = classId;
  if (subjectId) filter.subjectId = subjectId;
  if (medium) filter.medium = medium;
  if (typeOfQuestion) filter.typeOfQuestion = typeOfQuestion;
  if (questionType) filter.questionType = questionType;

  if (search) {
    const regex = { $regex: search.trim(), $options: 'i' };
    filter.$or = [{ module: regex }, { topicName: regex }];
  }

  const total = await QuestionBank.countDocuments(filter);

  const questions = await QuestionBank.find(filter)
    .populate("classId")
    .populate("subjectId")
    .sort({ createdAt: -1 })
    .skip(Number(offset))
    .limit(Number(limit));

  return {
    total,
    count: questions.length,
    questions,
    nextOffset: offset + limit < total ? Number(offset) + Number(limit) : null,
    prevOffset: offset - limit >= 0 ? Number(offset) - Number(limit) : null,
  };
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