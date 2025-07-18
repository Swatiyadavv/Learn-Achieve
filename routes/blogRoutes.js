const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

router.post("/add", upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "mainImage", maxCount: 1 }
]), protect,blogController.addOrUpdateBlog);

router.get("/",protect,blogController.getAllBlogs);

router.patch("/status/:id",protect, blogController.toggleBlogStatus);

router.delete("/delete", protect,blogController.deleteBlog); 


router.get("/:categoryId", blogController.getBlogsByCategory);

module.exports = router  ;
