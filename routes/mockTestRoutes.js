const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const mockTestController = require("../controller/mockTestController");
router.post("/create", protect, mockTestController.createandUpdate);  // craete mock test
router.get("/all", protect, mockTestController.getAllMockTests);  // get all 
router.get("/my-tests", protect, mockTestController.getMyMockTests);  // get my mocktest single
router.get("/search", protect, mockTestController.searchMockTest);  // search
router.put("/update/:id", protect, mockTestController.createandUpdate);  // upadte only by id 
router.put("/:id/status", protect, mockTestController.changeMockTestStatus);  // change startus using id
router.delete("/:id", protect, mockTestController.deleteMockTest);           // delete single mock test using id
router.get('/paginated',protect, mockTestController.getPaginatedPackages);     // paginated 
router.delete("/deleteAll", protect, mockTestController.allDeleteMockTest);        // delete all
module.exports = router;