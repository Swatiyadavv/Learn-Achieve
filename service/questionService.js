const QuestionBank = require("../model/questionModel");

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
