const Package = require('../model/Package');
const UserMockTest = require('../model/mockTestUser');

const assignMockTestsToUser = async (order, userId) => {
  for (const pkg of order.packages) {
    const packageData = await Package.findById(pkg.packageId);
    if (packageData?.mockTests?.length > 0) {
      for (const mockTest of packageData.mockTests) {
        await UserMockTest.create({
          userId,
          mockTest,
          packageId: pkg.packageId,
        });
      }
    }
  }
};

module.exports = { assignMockTestsToUser };
