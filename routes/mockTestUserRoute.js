const express = require('express');
const router = express.Router();
const { getUserMockTests } = require('../controller/mockTestUserController'); 
const { verifyUserToken } = require('../middleware/userAuth');

router.get('/my-mock-tests', verifyUserToken, getUserMockTests);

module.exports = router;
