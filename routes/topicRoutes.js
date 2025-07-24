// routes/topic.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const topicController = require('../controller/topicController');

router.post('/add', upload.single('file'),topicController.addOrUpdateTopic);
// routes/topicRoutes.js
router.delete('/delete',topicController.deleteTopic);
// get
router.get('/get', topicController.getAllTopics);
module.exports = router;
