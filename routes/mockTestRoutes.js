const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const mockTestController = require("../controller/mockTestController");

router.post("/create", protect, mockTestController.createMockTest);
router.get("/all", mockTestController.getAllMockTests);
router.get("/my-tests", protect, mockTestController.getMyMockTests);
router.get("/search", protect, mockTestController.searchMockTests);
router.put("/:id", protect, mockTestController.updateMockTest);
router.put("/:id/status", protect, mockTestController.changeMockTestStatus);
router.delete("/:id", protect, mockTestController.deleteMockTest);
router.get('/paginated', mockTestController.getPaginatedMockTests);

module.exports = router;
