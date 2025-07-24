const express = require('express');
const router = express.Router();
const controller = require('../controller/studyMaterialController');

router.post('/add', controller.addOrUpdateStudyMaterial); //  Add or Update
router.delete('/delete', controller.deleteStudyMaterial);        //  Delete
router.put('/toggle', controller.toggleStatus);          //  Status toggle
router.get('/get', controller.getStudyMaterials);               //  Get with filters
// http://localhost:5000/api/study/get?className=Class 9&subjectName=Sience&medium=Marathi&search=light&limit=5&offset=0
module.exports = router;
