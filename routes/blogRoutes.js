const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');
const upload = require('../middleware/uploadBlog');
const { verifyToken } = require('../middleware/authMiddleware'); //  Token middleware import

router.post(
  '/add',
  verifyToken,
  upload.fields([
    { name: 'featuredImage', maxCount: 1 },
    { name: 'mainImage', maxCount: 1 }
  ]),
  blogController.addBlog
);

router.get('/', blogController.getBlogs);

module.exports = router;
