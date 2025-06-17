const Subject = require('../model/subjectModel');
const fs = require('fs');
const path = require('path');

const SubjectService = {
  addOrUpdateSubject: async ({ id, name, subject, image, createdBy }) => {
    if (id) {
      const subjectDoc = await Subject.findById(id);
      if (!subjectDoc) throw new Error('Subject not found');

      subjectDoc.name = name;
      subjectDoc.subject = subject;
      subjectDoc.image = image || subjectDoc.image;

      await subjectDoc.save();
      return subjectDoc;
    } else {
      const newSubject = new Subject({ name, subject, image, createdBy });
      await newSubject.save();
      return newSubject;
    }
  },

  deleteSubject: async (id) => {
    const subject = await Subject.findById(id);
    if (!subject) throw new Error('Subject not found');
    if (subject.image) {
      const imagePath = path.resolve(subject.image);
      fs.unlink(imagePath, err => { if (err) console.error('Failed to delete image:', err); });
    }
    await Subject.findByIdAndDelete(id);
  },

 
  deleteAllByAdmin: async (adminId) => {
  const subjects = await Subject.find({ createdBy: adminId });

  for (const subject of subjects) {
    if (subject.image) {
      const imagePath = path.resolve(subject.image);
      fs.unlink(imagePath, err => {
        if (err) console.error('Failed to delete image:', err);
      });
    }
  }
    await Subject.deleteMany({ createdBy: adminId });
},

getAllSubjects: async (adminId) => {
  return await Subject.find({ createdBy: adminId }).sort({ createdAt: -1 });
},

  getPaginatedSubjects: async (limit, offset) => {
    const total = await Subject.countDocuments();
    const subjects = await Subject.find().skip(offset).limit(limit).sort({ createdAt: -1 });
    return {
      total,
      count: subjects.length,
      subjects,
      nextOffset: offset + limit < total ? offset + limit : null,
      prevOffset: offset - limit >= 0 ? offset - limit : null,
    };
  },

  searchSubjects: async (query) => {
    return await Subject.find({
      subject: { $regex: `^${query.trim()}`, $options: 'i' }
    });
  },

  updateMockTestStatus: async (id, adminId, status) => {
    if (!['active', 'inactive'].includes(status)) throw new Error('Invalid status');
    const subject = await Subject.findOneAndUpdate(
      { _id: id, createdBy: adminId },
      { status },
      { new: true }
    );
    if (!subject) throw new Error('Subject not found or unauthorized');
    return subject;
  },
};

module.exports = SubjectService;
