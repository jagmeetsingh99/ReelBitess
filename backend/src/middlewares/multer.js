const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),   // 🔥 MOST IMPORTANT
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files allowed"));
    }
    cb(null, true);
  },
});

module.exports = upload;
