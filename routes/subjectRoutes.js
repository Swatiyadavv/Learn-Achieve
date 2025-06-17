const express = require('express');
const router = express.Router();
const subjectController = require('../controller/subjectController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
// add or upadte
router.post('/add-or-update', protect, upload.single('image'), subjectController.addOrUpdateSubject);

// delete data by id 
router.delete('/delete/:id', protect, subjectController.deleteSubject);

// delete all
router.delete('/delete-all', protect, subjectController.deleteAllSubjectsByAdmin);

// get all
router.get('/get', protect, subjectController.getAllSubjects);

//paginated
router.get('/paginated', protect, subjectController.getPaginatedSubjects);

// search
router.get('/search', protect, subjectController.searchSubjects);

//status  change 
router.put('/status/:id', protect, subjectController.changeMockTestStatus);

module.exports = router;
