const express = require('express');
const router = express.Router();
const coordinatorController = require('../controller/coordinatorController');

// Routes
router.post('/', coordinatorController.addOrUpdateCoordinator);

router.get('/', coordinatorController.getCoordinators);

router.delete('/', coordinatorController.deleteCoordinator);

router.patch('/toggle', coordinatorController.toggleCoordinator);


module.exports = router;
