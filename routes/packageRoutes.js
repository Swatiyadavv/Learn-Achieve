const express = require('express');
const router = express.Router();
const packageController = require('../controller/packageController');
const upload = require('../middleware/uploadMiddleware');
const { verifyToken } = require('../middleware/authMiddleware'); //  Token middleware import
//  Add package (protected + image upload)
router.post('/add', verifyToken, upload.single('image'), packageController.addPackage);
//  Delete package by ID (protected)
router.delete('/delete/:id', verifyToken, packageController.deletePackage);
// Get all packages (protected)
router.get('/get', verifyToken, packageController.getAllPackages);
// Update package
router.put('/update/:id', verifyToken, upload.single('image'), packageController.updatePackage);
router.get('/search', verifyToken, packageController.searchPackages);
router.delete('/delete-multiple', verifyToken, packageController.deleteMultiplePackages);
router.get('/paginated', packageController.getPaginatedPackages);
//get packages with paginated
router.get('/paginated', verifyToken, packageController.getPaginatedPackages);
// users 
router.get('/packages', packageController.getAllPackages);
module.exports = router;   
