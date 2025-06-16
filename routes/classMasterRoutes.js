const express = require('express');
const router = express.Router();
// const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { protect } = require("../middleware/authMiddleware");

const classMasterController = require('../controller/classMasterController');

// Create class
router.post('/', protect, classMasterController.createClass);

// Get all active classes
router.get('/',protect, classMasterController.getActiveClasses);

// Get single class by ID
router.get('/:id', protect, classMasterController.getClassById);

// Update class by ID
router.put('/:id', protect, classMasterController.updateClass);

// Delete class by ID
router.delete('/:id', protect, classMasterController.deleteClass);

// Toggle active/inactive
router.put('/toggle/:id', protect, classMasterController.toggleActive);

module.exports = router;
