const express = require("express");
const rateLimit = require("express-rate-limit");
const { registerUser } = require("../controllers/authController");
const { loginUser } = require("../controllers/loginController");
const {
  getCurrentUser,
  updateCurrentUser,
  uploadProfilePicture,
  deleteProfilePicture,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { uploadAvatar } = require("../middleware/uploadMiddleware");

const router = express.Router();

/**
 * Login rate limiter: Maximum 5 requests per 15 minutes per IP
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again later.",
    });
  },
});

/**
 * Registration rate limiter: Maximum 10 requests per 15 minutes per IP
 */
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many registration attempts. Please try again later.",
    });
  },
});

router.post("/register", registerLimiter, registerUser);
router.post("/login", loginLimiter, loginUser);
router.get("/me", protect, getCurrentUser);
router.put("/me", protect, updateCurrentUser);
router.post("/profile-picture", protect, uploadAvatar, uploadProfilePicture);
router.delete("/profile-picture", protect, deleteProfilePicture);

module.exports = router;
