const Package = require('../model/Package');
const UserMockTest = require('../model/mockTestUser');

const assignMockTestsToUser = async (order, userId) => {
  for (const pkg of order.packages) {
    const packageData = await Package.findById(pkg.packageId);
    if (packageData?.mockTests?.length > 0) {
      const inserts = packageData.mockTests.map(mockTest => ({
        userId,
        mockTest,
        packageId: pkg.packageId,
      }));
      await UserMockTest.insertMany(inserts);
    }
  }
};

module.exports = { assignMockTestsToUser };
