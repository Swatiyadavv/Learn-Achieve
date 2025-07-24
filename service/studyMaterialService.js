const StudyMaterial = require('../model/studyMaterialModel');

const addStudyMaterial = async ({ classId, subjectId, medium, materialName, materialUrl }) => {
  const newMaterial = new StudyMaterial({ classId, subjectId, medium });
  return await newMaterial.save();
};

module.exports = { addStudyMaterial };
