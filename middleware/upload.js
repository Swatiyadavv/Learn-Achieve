const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder where files are saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});

const fileFilter = function (req, file, cb) {
  const allowedTypes = /\.(pdf|doc|docx|ppt|pptx)$/i;
  if (!allowedTypes.test(file.originalname)) {
    return cb(new Error('Only PDF, DOC, DOCX, PPT, or PPTX files are allowed'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter
});

module.exports = upload;
