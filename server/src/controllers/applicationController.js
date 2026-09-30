const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");

const ALLOWED_STATUSES = [
  "Submitted",
  "Applied",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Selected",
];

/**
 * @desc    Get all applications submitted by current authenticated user
 * @route   GET /api/applications
 * @access  Private
 */
const getMyApplications = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const applications = await Application.find({ user: userId })
      .populate("job")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching applications",
    });
  }
};

/**
 * @desc    Apply to a specific job
 * @route   POST /api/applications/:jobId
 * @access  Private
 */
const applyToJob = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { jobId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID format",
      });
    }

    // Verify job exists and is active
    const targetJob = await Job.findOne({ _id: jobId, isActive: true });
    if (!targetJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found or inactive",
      });
    }

    // Check for existing duplicate application
    const existingApp = await Application.findOne({ user: userId, job: jobId });
    if (existingApp) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this role",
      });
    }

    const { fullName, email, resumeName, notes } = req.body;

    // Validate required applicant fields
    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your full name and email address",
      });
    }

    // Create application (status defaults to schema default)
    const newApplication = await Application.create({
      user: userId,
      job: jobId,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      resumeName: resumeName ? resumeName.trim() : "",
      notes: notes ? notes.trim() : "",
    });

    await newApplication.populate("job");

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error) {
    console.error("Error applying to job:", error.message);

    // MongoDB duplicate key error code 11000 race-condition safety
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this role",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while submitting application",
    });
  }
};

/**
 * @desc    Get a single application by ID (scoped to owner)
 * @route   GET /api/applications/:id
 * @access  Private
 */
const getApplicationById = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID format",
      });
    }

    const application = await Application.findOne({
      _id: id,
      user: userId,
    }).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Error fetching application details:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching application",
    });
  }
};

/**
 * @desc    Update application status (restricted to employers and admins)
 * @route   PUT /api/applications/:id
 * @access  Private (Employer/Admin only)
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const userRole = req.user?.role;
    const { id } = req.params;
    const { status } = req.body;

    // Authorization: Job seekers cannot alter application status
    if (userRole !== "employer" && userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Only employers or administrators can update application status",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID format",
      });
    }

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Supported values are: ${ALLOWED_STATUSES.join(
          ", "
        )}`,
      });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Only status is modified
    application.status = status;
    await application.save();

    await application.populate("job");

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Error updating application status:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while updating application status",
    });
  }
};

/**
 * @desc    Withdraw/delete an application (scoped to owner)
 * @route   DELETE /api/applications/:id
 * @access  Private
 */
const withdrawApplication = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID format",
      });
    }

    const deleted = await Application.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    console.error("Error withdrawing application:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while withdrawing application",
    });
  }
};

module.exports = {
  getMyApplications,
  applyToJob,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
};
