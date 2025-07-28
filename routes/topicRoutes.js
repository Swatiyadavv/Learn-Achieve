// routes/topic.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const topicController = require('../controller/topicController');


router.post('/add', upload.array('files', 10), topicController.addOrUpdateTopic);
// routes/topicRoutes.js
router.delete('/delete',topicController.deleteTopic);
// get
router.get('/get/:moduleId', topicController.getAllTopics);
module.exports = router;
