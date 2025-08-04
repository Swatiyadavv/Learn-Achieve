
const express = require('express');
const router = express.Router();
const { getMockTestDetails ,getQuestionsBySubject} = require('../controller/mockTestUserController');

router.get('/mocktest/:mockTestId', getMockTestDetails);
//get  questions by subject id  
router.get('/mocktest/:mockTestId/subject/:subjectId/questions', getQuestionsBySubject);
module.exports = router;


// subject/686cc3ca9a03739da6fc7513/questions