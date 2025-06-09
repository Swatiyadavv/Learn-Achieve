const MockTest = require("../model/mockTestModel");
const { mockTestValidation } = require("../validation/mockTestValidation");

const createMockTest = async (data, adminId) => {
  const { error } = mockTestValidation.validate(data);
  if (error) throw new Error(error.details[0].message);
  return await MockTest.create({ ...data, createdBy: adminId });
};

const getAllMockTests = async () => {
  return await MockTest.find();
};


const getMyMockTests = async (adminId) => {
  return await MockTest.find({ createdBy: adminId });
};

const updateMockTest = async (id, data, adminId) => {
  const { error } = mockTestValidation.validate(data);
  if (error) throw new Error(error.details[0].message);

  const test = await MockTest.findOneAndUpdate(
    { _id: id, createdBy: adminId },
    data,
    { new: true }
  );
  if (!test) throw new Error("Not found or unauthorized");
  return test;
};

const deleteMockTest = async (id, adminId) => {
  const test = await MockTest.findOneAndDelete({ _id: id, createdBy: adminId });
  if (!test) throw new Error("Not found or unauthorized");
  return { message: "Deleted successfully" };
};

const searchMockTests = async (name, adminId) => {
  return await MockTest.find({
    mockTestName: { $regex: name, $options: "i" },
    createdBy: adminId,
  });
};

const updateMockTestStatus = async (id, adminId, status) => {
  const validStatuses = ["active", "inactive"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status value");
  }

  const test = await MockTest.findOneAndUpdate(
    { _id: id, createdBy: adminId },
    { status },
    { new: true }
  );

  if (!test) {
    throw new Error("MockTest not found or unauthorized");
  }

  return test;
};

module.exports = {
  createMockTest,
  getAllMockTests,
  getMyMockTests,
  updateMockTest,
  deleteMockTest,
  searchMockTests,
  updateMockTestStatus
};

