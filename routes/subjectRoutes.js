const express = require('express');
const router = express.Router();
const subjectController = require('../controller/subjectController');
const upload = require('../middleware/uploadMiddleware');
const { verifyToken } = require('../middleware/authMiddleware'); // Optional if routes are protected

// Add subject (protected + image upload)
router.post('/add', verifyToken, upload.single('image'), subjectController.addSubject);

// Delete subject by ID
router.delete('/delete/:id', verifyToken, subjectController.deleteSubject);

// Get all subjects
router.get('/get', verifyToken, subjectController.getAllSubjects);

// Update subject
router.put('/update/:id', verifyToken, upload.single('image'), subjectController.updateSubject);

// Search subjects
router.get('/search', verifyToken, subjectController.searchSubjects);

// Delete multiple subjects
router.delete('/delete-multiple', verifyToken, subjectController.deleteMultipleSubjects);

// Get paginated subjects
router.get('/paginated', verifyToken, subjectController.getPaginatedSubjects);

// Public route (optional)
router.get('/subjects', subjectController.getAllSubjects);

module.exports = router;
