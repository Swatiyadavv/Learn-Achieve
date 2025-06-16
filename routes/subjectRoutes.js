const express = require('express');
const router = express.Router();
const subjectController = require('../controller/subjectController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/add-or-update', protect, upload.single('image'), subjectController.addOrUpdateSubject);
router.delete('/delete/:id', protect, subjectController.deleteSubject);
router.delete('/delete-multiple', protect, subjectController.deleteMultipleSubjects);
router.get('/get', protect, subjectController.getAllSubjects);
router.get('/paginated', protect, subjectController.getPaginatedSubjects);
router.get('/search', protect, subjectController.searchSubjects);
router.put('/status/:id', protect, subjectController.changeMockTestStatus);

module.exports = router;
