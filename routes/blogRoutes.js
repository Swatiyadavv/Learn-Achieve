const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const upload = require("../middleware/uploadMiddleware");

router.post("/add", upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "mainImage", maxCount: 1 }
]), blogController.addOrUpdateBlog);

router.get("/", blogController.getAllBlogs);

router.patch("/status/:id", blogController.toggleBlogStatus);

router.delete("/delete", blogController.deleteBlog); 


module.exports = router;
