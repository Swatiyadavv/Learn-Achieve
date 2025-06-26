const MockTest = require("../model/mockTestModel");
const Subject = require("../model/subjectModel");
const ClassMaster = require("../model/classMasterModel");
const mongoose = require("mongoose");
const { mockTestValidation } = require("../validation/mockTestValidation");

const mockTestService = {
  // Create or Update
  createAndUpdate: async (data, id = null) => {
  const { error } = mockTestValidation.validate(data);
  if (error) throw new Error(error.details[0].message);

  const { mockTestName, medium, class: classIds, subjects, duration, totalQuestions } = data;

  // Validate ObjectIds
  const allIds = [...classIds, ...subjects];
  for (const _id of allIds) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new Error(`Invalid ObjectId: ${_id}`);
    }
  }

  // Check class existence
  const classCount = await ClassMaster.countDocuments({ _id: { $in: classIds } });
  if (classCount !== classIds.length) {
    throw new Error("One or more class IDs are invalid");
  }

  // Check subject existence
  const subjectDocs = await Subject.find({ _id: { $in: subjects } });
  if (subjectDocs.length !== subjects.length) {
    throw new Error("One or more subject IDs are invalid");
  }

  // Check for duplicate (only when creating or updating to new values)
  const duplicateQuery = {
    mockTestName,
    class: { $all: classIds, $size: classIds.length },
    subjects: { $all: subjects, $size: subjects.length },
  };

  if (id) {
    // Prevent conflict with other mock tests
    const existing = await MockTest.findOne({ ...duplicateQuery, _id: { $ne: id } });
    if (existing) {
      throw new Error("Another mock test with same name, class, and subjects already exists");
    }
  } else {
    const existing = await MockTest.findOne(duplicateQuery);
    if (existing) {
      throw new Error("Mock test with same name, class, and subjects already exists");
    }
  }

  const mockTestData = {
    mockTestName,
    medium,
    class: classIds,
    subjects,
    duration,
    totalQuestions,
  };

  if (id) {
    const updated = await MockTest.findByIdAndUpdate(id, mockTestData, { new: true });
    if (!updated) throw new Error("Mock test not found");
    return updated;
  } else {
    const created = new MockTest(mockTestData);
    await created.save();
    return created;
  }
},

  // Combined: Get all + Search + Pagination
  getPaginatedMockTests: async (query, limit, offset) => {
    const filter = query
      ? { mockTestName: { $regex: query.trim(), $options: "i" } }
      : {};

    const total = await MockTest.countDocuments(filter);

    const data = await MockTest.find(filter)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("class", "class")
      .populate("subjects", "subject");

      
    return {
      total,
      count: data.length,
      mockTests: data,
      nextOffset: offset + limit < total ? offset + limit : null,
      prevOffset: offset - limit >= 0 ? offset - limit : null,
    };
  },

  // Get by ID
  getMockTestById: async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    const test = await MockTest.findById(id)
      .populate("class", "class")
      .populate("subjects", "subject");

    if (!test) throw new Error("Mock test not found");
    return test;
  },

  // Status change
  updateMockTestStatus: async (id, status) => {
    if (!["active", "inactive"].includes(status)) {
      throw new Error("Invalid status");
    }

    const updated = await MockTest.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) throw new Error("Mock test not found");

    return updated;
  },

  // Smart Delete
  deleteMockTest: async (id) => {
    const deleted = await MockTest.findByIdAndDelete(id);
    if (!deleted) throw new Error("Mock test not found");
    return { message: "Mock test deleted" };
  },

  deleteMultipleMockTests: async (ids) => {
    const deleted = await MockTest.deleteMany({ _id: { $in: ids } });
    return { message: `${deleted.deletedCount} mock test(s) deleted` };
  }
};

module.exports = mockTestService;
