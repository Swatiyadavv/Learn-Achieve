const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const classMasterController = require('../controller/classMasterController');
// Create class
router.post('/', protect, classMasterController.createClass);
// Get all classes (active + inactive) with pagination + search
router.get('/all', protect, classMasterController.getAllClasses);
// Get all active classes with pagination + search
router.get('/active', protect, classMasterController.getPaginatedActiveClasses);
// Get single class by ID
router.get('/:id', protect, classMasterController.getClassById);
// Update class by ID
router.put('/:id', protect, classMasterController.updateClass);
// DELETE single and multiple classes by IDs
router.delete('/', protect, classMasterController.deleteClass);
// Toggle active/inactive
router.put('/toggle/:id', protect, classMasterController.toggleActive);
module.exports = router;
