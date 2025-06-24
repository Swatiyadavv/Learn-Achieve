const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const classMasterController = require('../controller/classMasterController');


// add and update with same routes
router.post('/', protect, classMasterController.addOrUpdateClass);


// Get all classes (active + inactive) with pagination + search
router.get('/all', protect, classMasterController.getAllClasses);

// DELETE single and multiple classes by IDs
router.delete('/', protect, classMasterController.deleteClass);

// Toggle active/inactive
router.put('/toggle/:id', protect, classMasterController.toggleActive);

module.exports = router;
