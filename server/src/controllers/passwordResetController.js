const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendPasswordResetEmail } = require("../services/emailService");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates password complexity matching CareerVista registration standards
 *
 * @param {string} password
 * @returns {string|null} Error message or null if valid
 */
const validatePasswordComplexity = (password) => {
  if (typeof password !== "string" || !password) {
    return "Password is required.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (password.length > 72) {
    return "Password must be 72 characters or fewer.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one number.";
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return "Password must contain at least one special character.";
  }
  return null;
};

/**
 * @desc    Request a password reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public (Rate Limited)
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail.length > 254) {
      return res.status(400).json({
        success: false,
        message: "Email must be 254 characters or fewer.",
      });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Generic response message to prevent account enumeration
    const genericSuccessResponse = {
      success: true,
      message:
        "If an account with that email address exists, a password reset link has been sent.",
    };

    const user = await User.findOne({ email: normalizedEmail });

    // If user does not exist, return generic response without revealing account status
    if (!user) {
      return res.status(200).json(genericSuccessResponse);
    }

    // Generate cryptographically secure unhashed reset token (32 bytes = 64 hex characters)
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store only the SHA-256 hash of the token in the database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expiration to 15 minutes from now
    const tokenExpiration = new Date(Date.now() + 15 * 60 * 1000);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = tokenExpiration;
    await user.save({ validateBeforeSave: false });

    // Construct the client reset URL
    const clientOrigin =
      process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientOrigin.replace(/\/$/, "")}/reset-password/${resetToken}`;

    // Dispatch email via configured email provider (or simulated logger in development)
    const emailResult = await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
    });

    // In local development mode without SMTP, provide the simulated URL for instant local verification
    const isDevelopment =
      process.env.NODE_ENV !== "production" && emailResult.simulated;

    if (isDevelopment) {
      return res.status(200).json({
        ...genericSuccessResponse,
        devNotice:
          "SMTP is not configured. For local development testing, use the resetUrl below or inspect the server console.",
        devResetUrl: resetUrl,
      });
    }

    return res.status(200).json(genericSuccessResponse);
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error processing password reset request.",
    });
  }
};

/**
 * @desc    Reset password using single-use token
 * @route   POST /api/auth/reset-password
 * @access  Public (Rate Limited)
 */
const resetPassword = async (req, res) => {
  try {
    const rawToken = req.body?.token || req.params?.token;
    const { password } = req.body || {};

    if (typeof rawToken !== "string" || !rawToken.trim()) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is required.",
      });
    }

    const token = rawToken.trim();

    // Verify token structure (64 hex characters)
    if (!/^[a-fA-F0-9]{64}$/.test(token)) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired.",
      });
    }

    // Validate password complexity
    const passwordError = validatePasswordComplexity(password);
    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError,
      });
    }

    // Hash the token received from the user to query against database
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Look for user with matching unexpired token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired.",
      });
    }

    // Hash the new password with bcrypt (10 rounds)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update password and invalidate single-use token immediately
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password has been successfully reset. You can now sign in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error resetting password.",
    });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
  validatePasswordComplexity,
};
