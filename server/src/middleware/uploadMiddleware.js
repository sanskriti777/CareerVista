const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists: server/uploads/avatars/
const uploadDir = path.join(__dirname, "../../uploads/avatars");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed MIME types and extensions
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

// Configure Multer disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user?.userId || "user";
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const safeFilename = `avatar-${userId}-${timestamp}-${random}${ext}`;
    cb(null, safeFilename);
  },
});

// File filter for security
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype) || !ALLOWED_EXTENSIONS.includes(ext)) {
    const error = new Error("Only .jpg, .jpeg, .png, and .webp images are allowed");
    error.code = "INVALID_FILE_TYPE";
    return cb(error, false);
  }

  cb(null, true);
};

// Maximum file size: 3 MB
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3 MB
  },
});

// Wrapper middleware to provide clean JSON errors for Multer exceptions
const uploadAvatar = (req, res, next) => {
  upload.single("profilePicture")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size exceeds the 3MB limit.",
        });
      }
      if (err.code === "INVALID_FILE_TYPE") {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || "Failed to upload image file.",
      });
    }
    next();
  });
};

module.exports = {
  uploadAvatar,
  uploadDir,
};
