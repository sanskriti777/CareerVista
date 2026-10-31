const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const { uploadDir } = require("../middleware/uploadMiddleware");

const ALLOWED_EMPLOYMENT_TYPES = [
  "Full Time",
  "Part Time",
  "Internship",
  "Contract",
  "Freelance",
];

const YYYY_MM_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

/**
 * Validates whether a string is a safe HTTP or HTTPS URL
 */
const isValidHttpUrl = (str) => {
  if (typeof str !== "string") return false;
  const trimmed = str.trim();
  if (!trimmed) return true; // empty optional URL is acceptable
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
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
        phone: user.phone || "",
        location: user.location || "",
        headline: user.headline || "",
        preferredRole: user.preferredRole || "",
        skills: Array.isArray(user.skills) ? user.skills : [],
        resumeUrl: user.resumeUrl || "",
        profilePicture: user.profilePicture || "",
        bio: user.bio || "",
        isFresher: Boolean(user.isFresher),
        education: Array.isArray(user.education) ? user.education : [],
        experience: Array.isArray(user.experience) ? user.experience : [],
        projects: Array.isArray(user.projects) ? user.projects : [],
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

/**
 * @desc    Update current authenticated user profile
 * @route   PUT /api/auth/me
 * @access  Private
 */
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
      bio,
      isFresher,
      education,
      experience,
      projects,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ----------------------------------------------------
    // 1. BASIC INFORMATION VALIDATION & ASSIGNMENT
    // ----------------------------------------------------
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Name must be at least 2 characters.",
        });
      }
      if (name.trim().length > 60) {
        return res.status(400).json({
          success: false,
          message: "Name cannot exceed 60 characters.",
        });
      }
      user.name = name.trim();
    }

    if (phone !== undefined) {
      if (typeof phone !== "string") {
        return res.status(400).json({
          success: false,
          message: "Phone must be a valid string.",
        });
      }
      user.phone = phone.trim();
    }

    if (location !== undefined) {
      if (typeof location !== "string") {
        return res.status(400).json({
          success: false,
          message: "Location must be a valid string.",
        });
      }
      user.location = location.trim();
    }

    if (headline !== undefined) {
      if (typeof headline !== "string") {
        return res.status(400).json({
          success: false,
          message: "Headline must be a valid string.",
        });
      }
      user.headline = headline.trim();
    }

    if (preferredRole !== undefined) {
      if (typeof preferredRole !== "string") {
        return res.status(400).json({
          success: false,
          message: "Preferred role must be a valid string.",
        });
      }
      user.preferredRole = preferredRole.trim();
    }

    if (resumeUrl !== undefined) {
      if (typeof resumeUrl !== "string") {
        return res.status(400).json({
          success: false,
          message: "Resume URL must be a valid string.",
        });
      }
      const trimmedResume = resumeUrl.trim();
      if (trimmedResume && !isValidHttpUrl(trimmedResume)) {
        return res.status(400).json({
          success: false,
          message: "Resume URL must be a valid HTTP or HTTPS web address.",
        });
      }
      user.resumeUrl = trimmedResume;
    }

    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return res.status(400).json({
          success: false,
          message: "Skills must be an array of strings.",
        });
      }
      user.skills = Array.from(
        new Set(
          skills
            .filter((s) => typeof s === "string")
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        )
      );
    }

    // ----------------------------------------------------
    // 2. BIO & FRESHER STATUS
    // ----------------------------------------------------
    if (bio !== undefined) {
      if (typeof bio !== "string") {
        return res.status(400).json({
          success: false,
          message: "Bio must be a valid string.",
        });
      }
      const trimmedBio = bio.trim();
      if (trimmedBio.length > 1500) {
        return res.status(400).json({
          success: false,
          message: "Bio cannot exceed 1500 characters.",
        });
      }
      user.bio = trimmedBio;
    }

    if (isFresher !== undefined) {
      user.isFresher = Boolean(isFresher);
    }

    // ----------------------------------------------------
    // 3. EDUCATION ARRAY VALIDATION & ASSIGNMENT
    // ----------------------------------------------------
    if (education !== undefined) {
      if (!Array.isArray(education)) {
        return res.status(400).json({
          success: false,
          message: "Education must be an array of education records.",
        });
      }

      if (education.length > 5) {
        return res.status(400).json({
          success: false,
          message: "Education cannot exceed 5 entries.",
        });
      }

      const validatedEducation = [];

      for (let i = 0; i < education.length; i++) {
        const item = education[i];

        if (!item || typeof item !== "object" || Array.isArray(item)) {
          return res.status(400).json({
            success: false,
            message: `Education entry at position ${i + 1} must be an object.`,
          });
        }

        const degree = typeof item.degree === "string" ? item.degree.trim() : "";
        if (!degree || degree.length < 2) {
          return res.status(400).json({
            success: false,
            message: `Degree at position ${i + 1} is required and must be at least 2 characters.`,
          });
        }
        if (degree.length > 100) {
          return res.status(400).json({
            success: false,
            message: `Degree at position ${i + 1} cannot exceed 100 characters.`,
          });
        }

        const institution =
          typeof item.institution === "string" ? item.institution.trim() : "";
        if (!institution || institution.length < 2) {
          return res.status(400).json({
            success: false,
            message: `Institution at position ${i + 1} is required and must be at least 2 characters.`,
          });
        }
        if (institution.length > 150) {
          return res.status(400).json({
            success: false,
            message: `Institution at position ${i + 1} cannot exceed 150 characters.`,
          });
        }

        const fieldOfStudy =
          typeof item.fieldOfStudy === "string" ? item.fieldOfStudy.trim() : "";
        if (fieldOfStudy.length > 100) {
          return res.status(400).json({
            success: false,
            message: `Field of study at position ${i + 1} cannot exceed 100 characters.`,
          });
        }

        const startYearNum = Number(item.startYear);
        if (
          !Number.isInteger(startYearNum) ||
          startYearNum < 1960 ||
          startYearNum > 2100
        ) {
          return res.status(400).json({
            success: false,
            message: `Start year at position ${i + 1} must be a valid year between 1960 and 2100.`,
          });
        }

        const currentlyStudying = Boolean(item.currentlyStudying);
        let finalEndYear = null;

        if (!currentlyStudying) {
          if (
            item.endYear !== undefined &&
            item.endYear !== null &&
            item.endYear !== ""
          ) {
            const endYearNum = Number(item.endYear);
            if (
              !Number.isInteger(endYearNum) ||
              endYearNum < 1960 ||
              endYearNum > 2100
            ) {
              return res.status(400).json({
                success: false,
                message: `End year at position ${i + 1} must be a valid year between 1960 and 2100.`,
              });
            }
            if (endYearNum < startYearNum) {
              return res.status(400).json({
                success: false,
                message: `End year (${endYearNum}) cannot be earlier than start year (${startYearNum}) at position ${i + 1}.`,
              });
            }
            finalEndYear = endYearNum;
          }
        }

        const record = {
          degree,
          institution,
          fieldOfStudy,
          startYear: startYearNum,
          endYear: finalEndYear,
          currentlyStudying,
        };

        if (item._id) {
          record._id = item._id;
        }

        validatedEducation.push(record);
      }

      user.education = validatedEducation;
    }

    // ----------------------------------------------------
    // 4. EXPERIENCE ARRAY VALIDATION & ASSIGNMENT
    // ----------------------------------------------------
    if (experience !== undefined) {
      if (!Array.isArray(experience)) {
        return res.status(400).json({
          success: false,
          message: "Experience must be an array of experience records.",
        });
      }

      if (experience.length > 10) {
        return res.status(400).json({
          success: false,
          message: "Experience cannot exceed 10 entries.",
        });
      }

      const validatedExperience = [];

      for (let i = 0; i < experience.length; i++) {
        const item = experience[i];

        if (!item || typeof item !== "object" || Array.isArray(item)) {
          return res.status(400).json({
            success: false,
            message: `Experience entry at position ${i + 1} must be an object.`,
          });
        }

        const jobTitle =
          typeof item.jobTitle === "string" ? item.jobTitle.trim() : "";
        if (!jobTitle || jobTitle.length < 2) {
          return res.status(400).json({
            success: false,
            message: `Job title at position ${i + 1} is required and must be at least 2 characters.`,
          });
        }
        if (jobTitle.length > 100) {
          return res.status(400).json({
            success: false,
            message: `Job title at position ${i + 1} cannot exceed 100 characters.`,
          });
        }

        const company =
          typeof item.company === "string" ? item.company.trim() : "";
        if (!company || company.length < 2) {
          return res.status(400).json({
            success: false,
            message: `Company name at position ${i + 1} is required and must be at least 2 characters.`,
          });
        }
        if (company.length > 150) {
          return res.status(400).json({
            success: false,
            message: `Company name at position ${i + 1} cannot exceed 150 characters.`,
          });
        }

        const employmentType =
          typeof item.employmentType === "string" &&
          ALLOWED_EMPLOYMENT_TYPES.includes(item.employmentType.trim())
            ? item.employmentType.trim()
            : "Full Time";

        const startDate =
          typeof item.startDate === "string" ? item.startDate.trim() : "";
        if (!startDate || !YYYY_MM_REGEX.test(startDate)) {
          return res.status(400).json({
            success: false,
            message: `Start date at position ${i + 1} is required and must follow the format YYYY-MM (e.g. 2024-05).`,
          });
        }

        const currentlyWorking = Boolean(item.currentlyWorking);
        let finalEndDate = "";

        if (!currentlyWorking) {
          if (typeof item.endDate === "string" && item.endDate.trim()) {
            const trimmedEnd = item.endDate.trim();
            if (!YYYY_MM_REGEX.test(trimmedEnd)) {
              return res.status(400).json({
                success: false,
                message: `End date at position ${i + 1} must follow the format YYYY-MM (e.g. 2025-02).`,
              });
            }
            if (trimmedEnd < startDate) {
              return res.status(400).json({
                success: false,
                message: `End date (${trimmedEnd}) cannot be earlier than start date (${startDate}) at position ${i + 1}.`,
              });
            }
            finalEndDate = trimmedEnd;
          }
        }

        const description =
          typeof item.description === "string" ? item.description.trim() : "";
        if (description.length > 1000) {
          return res.status(400).json({
            success: false,
            message: `Description at position ${i + 1} cannot exceed 1000 characters.`,
          });
        }

        const record = {
          jobTitle,
          company,
          employmentType,
          startDate,
          endDate: finalEndDate,
          currentlyWorking,
          description,
        };

        if (item._id) {
          record._id = item._id;
        }

        validatedExperience.push(record);
      }

      user.experience = validatedExperience;
    }

    // ----------------------------------------------------
    // 5. PROJECTS ARRAY VALIDATION & ASSIGNMENT
    // ----------------------------------------------------
    if (projects !== undefined) {
      if (!Array.isArray(projects)) {
        return res.status(400).json({
          success: false,
          message: "Projects must be an array of project records.",
        });
      }

      if (projects.length > 6) {
        return res.status(400).json({
          success: false,
          message: "Projects cannot exceed 6 entries.",
        });
      }

      const validatedProjects = [];

      for (let i = 0; i < projects.length; i++) {
        const item = projects[i];

        if (!item || typeof item !== "object" || Array.isArray(item)) {
          return res.status(400).json({
            success: false,
            message: `Project entry at position ${i + 1} must be an object.`,
          });
        }

        const name = typeof item.name === "string" ? item.name.trim() : "";
        if (!name || name.length < 2) {
          return res.status(400).json({
            success: false,
            message: `Project name at position ${i + 1} is required and must be at least 2 characters.`,
          });
        }
        if (name.length > 120) {
          return res.status(400).json({
            success: false,
            message: `Project name at position ${i + 1} cannot exceed 120 characters.`,
          });
        }

        const description =
          typeof item.description === "string" ? item.description.trim() : "";
        if (!description || description.length < 10) {
          return res.status(400).json({
            success: false,
            message: `Project description at position ${i + 1} is required and must be at least 10 characters.`,
          });
        }
        if (description.length > 600) {
          return res.status(400).json({
            success: false,
            message: `Project description at position ${i + 1} cannot exceed 600 characters.`,
          });
        }

        const technologies = Array.isArray(item.technologies)
          ? Array.from(
              new Set(
                item.technologies
                  .filter((t) => typeof t === "string")
                  .map((t) => t.trim())
                  .filter((t) => t.length > 0)
              )
            )
          : [];

        const projectUrl =
          typeof item.projectUrl === "string" ? item.projectUrl.trim() : "";
        if (projectUrl && !isValidHttpUrl(projectUrl)) {
          return res.status(400).json({
            success: false,
            message: `Project URL at position ${i + 1} must be a valid HTTP or HTTPS web address.`,
          });
        }

        const githubUrl =
          typeof item.githubUrl === "string" ? item.githubUrl.trim() : "";
        if (githubUrl && !isValidHttpUrl(githubUrl)) {
          return res.status(400).json({
            success: false,
            message: `GitHub URL at position ${i + 1} must be a valid HTTP or HTTPS web address.`,
          });
        }

        const record = {
          name,
          description,
          technologies,
          projectUrl,
          githubUrl,
        };

        if (item._id) {
          record._id = item._id;
        }

        validatedProjects.push(record);
      }

      user.projects = validatedProjects;
    }

    // ----------------------------------------------------
    // 6. SAVE AND RESPOND
    // ----------------------------------------------------
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        location: user.location || "",
        headline: user.headline || "",
        preferredRole: user.preferredRole || "",
        skills: Array.isArray(user.skills) ? user.skills : [],
        resumeUrl: user.resumeUrl || "",
        profilePicture: user.profilePicture || "",
        bio: user.bio || "",
        isFresher: Boolean(user.isFresher),
        education: Array.isArray(user.education) ? user.education : [],
        experience: Array.isArray(user.experience) ? user.experience : [],
        projects: Array.isArray(user.projects) ? user.projects : [],
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

/**
 * Helper to safely delete an old avatar file from uploads/avatars/
 */
const safeDeleteAvatarFile = (relativePath) => {
  if (!relativePath || typeof relativePath !== "string") return;
  try {
    const filename = path.basename(relativePath);
    if (!filename || filename === "." || filename === "..") return;
    const fullPath = path.join(uploadDir, filename);

    // Verify file is within uploadDir
    if (fullPath.startsWith(uploadDir) && fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.error("Failed to delete old avatar file safely:", err.message);
  }
};

/**
 * @desc    Upload authenticated user's profile picture
 * @route   POST /api/auth/profile-picture
 * @access  Private
 */
const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image file to upload.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      // Remove newly uploaded file if user not found
      if (req.file.path && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (_) {}
      }
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Safely delete previous custom avatar if exists
    if (user.profilePicture) {
      safeDeleteAvatarFile(user.profilePicture);
    }

    const relativeUrl = `/uploads/avatars/${req.file.filename}`;
    user.profilePicture = relativeUrl;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        location: user.location || "",
        headline: user.headline || "",
        preferredRole: user.preferredRole || "",
        skills: Array.isArray(user.skills) ? user.skills : [],
        resumeUrl: user.resumeUrl || "",
        profilePicture: user.profilePicture || "",
        bio: user.bio || "",
        isFresher: Boolean(user.isFresher),
        education: Array.isArray(user.education) ? user.education : [],
        experience: Array.isArray(user.experience) ? user.experience : [],
        projects: Array.isArray(user.projects) ? user.projects : [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while uploading profile picture",
    });
  }
};

/**
 * @desc    Remove authenticated user's profile picture
 * @route   DELETE /api/auth/profile-picture
 * @access  Private
 */
const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.profilePicture) {
      safeDeleteAvatarFile(user.profilePicture);
      user.profilePicture = "";
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Profile picture removed successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        location: user.location || "",
        headline: user.headline || "",
        preferredRole: user.preferredRole || "",
        skills: Array.isArray(user.skills) ? user.skills : [],
        resumeUrl: user.resumeUrl || "",
        profilePicture: "",
        bio: user.bio || "",
        isFresher: Boolean(user.isFresher),
        education: Array.isArray(user.education) ? user.education : [],
        experience: Array.isArray(user.experience) ? user.experience : [],
        projects: Array.isArray(user.projects) ? user.projects : [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error deleting profile picture:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while removing profile picture",
    });
  }
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  uploadProfilePicture,
  deleteProfilePicture,
};