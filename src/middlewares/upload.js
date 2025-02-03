// middlewares/upload.js
const multer = require('multer');

// Use memoryStorage so that the uploaded file is available in req.file.buffer
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB (adjust as needed)
});

module.exports = upload;
