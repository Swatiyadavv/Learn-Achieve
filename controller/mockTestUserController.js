// controller/mockTestUserController.js

const UserMockTest = require('../model/mockTestUser');

const getUserMockTests = async (req, res) => {
  try {
    const userId = req.user.id;
    const mockTests = await UserMockTest.find({ userId });
    res.status(200).json({ mockTests });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch mock tests', error: err.message });
  }
};

module.exports = { getUserMockTests };
