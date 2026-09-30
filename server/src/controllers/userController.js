const User = require("../models/User");

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        headline: user.headline,
        preferredRole: user.preferredRole,
        skills: user.skills,
        resumeUrl: user.resumeUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching current user:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};

const updateCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const {
      name,
      phone,
      location,
      headline,
      preferredRole,
      skills,
      resumeUrl,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (location !== undefined) user.location = location.trim();
    if (headline !== undefined) user.headline = headline.trim();
    if (preferredRole !== undefined) {
      user.preferredRole = preferredRole.trim();
    }
    if (skills !== undefined) user.skills = skills;
    if (resumeUrl !== undefined) user.resumeUrl = resumeUrl.trim();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        headline: user.headline,
        preferredRole: user.preferredRole,
        skills: user.skills,
        resumeUrl: user.resumeUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating current user:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
};