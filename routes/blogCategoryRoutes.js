const express = require("express");
const router = express.Router();
const blogCategoryController = require("../controller/blogCategoryController");
const { protect } = require('../middleware/authMiddleware');


//  Add or Update
router.post("/add", blogCategoryController.addOrUpdateBlogCategory);

//  Get All
router.get("/", protect,blogCategoryController.getAllCategories);
// http://localhost:5000/api/blog?search=stu&limit=5&offset=0

//  Toggle Status
router.put("/toggle/:id",protect,blogCategoryController.toggleStatus);

// Delete
router.delete("/",protect, blogCategoryController.deleteCategory);

module.exports = router;
