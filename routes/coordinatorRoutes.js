const express = require('express');
const router = express.Router();
const coordinatorController = require('../controller/coordinatorController');

// Routes
router.post('/add', coordinatorController.addOrUpdateCoordinator);

router.get('/get', coordinatorController.getCoordinators);

router.delete('/delete', coordinatorController.deleteCoordinator);

router.patch('/toggle/:id', coordinatorController.toggleCoordinator);



module.exports = router;
