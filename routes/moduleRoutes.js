const express = require('express');
const router = express.Router();
const moduleController = require('../controller/moduleController');

// Add or Edit Module (same route, optional ID)
router.post('/modules', moduleController.addOrUpdateModule);

// Get Modules by StudyMaterial ID
router.get('/modules/:studyMaterialId', moduleController.getModulesByMaterial);

// Delete Modules (single or multiple)
router.delete('/modules/delete', moduleController.deleteModules);

module.exports = router;
