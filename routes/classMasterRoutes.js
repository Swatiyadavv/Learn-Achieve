const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const classMasterController = require('../controller/classMasterController');

// Create class
router.post('/', protect, classMasterController.createClass);

// Get paginated active classes
router.get('/', protect, classMasterController.getPaginatedActiveClasses);

// Search active classes
router.get('/active/search', protect, classMasterController.getActiveClassesWithSearch);

// Get all classes (active + inactive) 
router.get('/all', protect, classMasterController.getAllClasses);

// Get single class by ID
router.get('/:id', protect, classMasterController.getClassById);

// Update class by ID
router.put('/:id', protect, classMasterController.updateClass);

// Delete class by ID
router.delete('/:id', protect, classMasterController.deleteClass);

// Toggle active/inactive
router.put('/toggle/:id', protect, classMasterController.toggleActive);



module.exports = router;
