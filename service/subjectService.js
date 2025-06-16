const Subject = require('../model/subjectModel');
const fs = require('fs');
const path = require('path');

const SubjectService = {
  addSubject: async ({ name, Subject: subjectName, image }) => {
    const newSubject = new Subject({
      name,
      Subject: subjectName,
      image,
    });

    await newSubject.save();
    return newSubject;
  },

  deleteSubject: async (id) => {
    const subject = await Subject.findById(id);
    if (!subject) {
      throw new Error('Subject not found');
    }

    if (subject.image) {
      const imagePath = path.resolve(subject.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Failed to delete image:', err);
      });
    }

    await Subject.findByIdAndDelete(id);
  },

  getAllSubjects: async () => {
    return await Subject.find();
  },

  updateSubject: async (id, updatedData, file) => {
    const subject = await Subject.findById(id);
    if (!subject) throw new Error('Subject not found');

    if (updatedData.name) subject.name = updatedData.name;
    if (updatedData.Subject) subject.Subject = updatedData.Subject;

    if (file) {
      if (subject.image) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(subject.image));
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Failed to delete old image:', err);
        });
      }

      subject.image = `${file.protocol || 'http'}://${file.host || 'localhost:5000'}/uploads/${file.filename}`;
    }

    await subject.save();
    return subject;
  },

  searchSubjects: async (query) => {
    const trimmedQuery = query.trim();
    return await Subject.find({
      Subject: { $regex: `^${trimmedQuery}`, $options: 'i' }
    });
  },

  deleteMultipleSubjects: async (ids) => {
    const subjects = await Subject.find({ _id: { $in: ids } });

    for (const subject of subjects) {
      if (subject.image) {
        const imagePath = path.join(__dirname, '..', 'uploads', path.basename(subject.image));
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Failed to delete image:', err);
        });
      }
    }

    await Subject.deleteMany({ _id: { $in: ids } });
  },

  getPaginatedSubjects: async (limit, offset) => {
    const total = await Subject.countDocuments();
    const subjects = await Subject.find()
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      total,
      count: subjects.length,
      subjects,
      nextOffset: offset + limit < total ? offset + limit : null,
      prevOffset: offset - limit >= 0 ? offset - limit : null,
    };
  },
};

module.exports = SubjectService;
