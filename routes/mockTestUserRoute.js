const express = require('express');
const router = express.Router();
const { getUserMockTests } = require('../controller/mockTestUserController');
const { protect } = require('../middleware/authMiddleware');
router.get('/my-mock-tests', protect, getUserMockTests);

module.exports = router;
