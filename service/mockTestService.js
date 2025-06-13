const MockTest = require("../model/mockTestModel");
const { mockTestValidation } = require("../validation/mockTestValidation");

const mockTestService = {
 createMockTest :async (data, adminId) => {
  const { error } = mockTestValidation.validate(data);
  if (error) throw new Error(error.details[0].message);
  return await MockTest.create({ ...data, createdBy: adminId });
},

 getAllMockTests :  async () => {
  return await MockTest.find();
},

getMyMockTests : async (adminId) => {
  return await MockTest.find({ createdBy: adminId });
},

allDeleteMockTests: async (adminId) => {
  const result = await MockTest.deleteMany({ createdBy: adminId });
  return {
    message: `${result.deletedCount} mock test(s) deleted successfully`
  };
},

 updateMockTest : async (id, data, adminId) => {
  const { error } = mockTestValidation.validate(data);
  if (error) throw new Error(error.details[0].message);

  const test = await MockTest.findOneAndUpdate(
    { _id: id, createdBy: adminId },
    data,
    { new: true }
  );
  if (!test) throw new Error("Not found or unauthorized");
  return test;
},

 deleteMockTest : async (id, adminId) => {
  const test = await MockTest.findOneAndDelete({ _id: id, createdBy: adminId });
  if (!test) throw new Error("Not found or unauthorized");
  return { message: "Deleted successfully" };
},

 searchMockTests : async (name, adminId) => {
  return await MockTest.find({
    mockTestName: { $regex: name, $options: "i" },
    createdBy: adminId,
  });
},

 updateMockTestStatus : async (id, adminId, status) => {
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
},
searchMockTest: async (query) => {
  const trimmedQuery = query.trim();

  return await MockTest.find({
     mockTestName: { $regex: `^${trimmedQuery}`, $options: 'i' }// exact match, case-insensitive
  });
},


  getPaginatedPackages : async (limit, offset) => {
    const total = await MockTest.countDocuments();
    const packages = await MockTest.find()
      .skip(offset)
      .limit(limit);
  
    return {
      total,
      count: packages.length,
      packages,
      nextOffset: offset + limit < total ? offset + limit : null,
      prevOffset: offset - limit >= 0 ? offset - limit : null,
    };
  },
}
  module.exports = mockTestService;