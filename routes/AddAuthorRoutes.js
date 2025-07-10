// routes/authorRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authorController = require('../controller/AddAuthorController');


// Ensure uploads/author directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'author');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.jpg', '.jpeg', '.webp'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only jpg, jpeg, and webp files are allowed'), false);
    }
  }
});

// http://localhost:5000/uploads/author/1752138969597.jpg --> for image url

router.post('/add', upload.single('image'), authorController.addAuthor);
// get with limit offset and search 
router.get('/get', authorController.getAllAuthors);
router.delete('/delete', authorController.deleteAuthorController);
router.patch('/toggle/:id', authorController.toggleAuthorStatus);

module.exports = router;
