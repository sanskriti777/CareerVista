const mongoose = require("mongoose");
const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");

/**
 * @desc    Get all saved jobs for current authenticated user
 * @route   GET /api/saved-jobs
 * @access  Private
 */
const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const records = await SavedJob.find({ user: userId })
      .populate("job")
      .sort({ createdAt: -1 });

    // Only return records where the referenced job exists and is active
    const activeSavedJobs = records
      .filter((record) => record.job && record.job.isActive)
      .map((record) => ({
        _id: record._id,
        createdAt: record.createdAt,
        job: {
          _id: record.job._id,
          title: record.job.title,
          company: record.job.company,
          location: record.job.location,
          type: record.job.type,
          salary: record.job.salary,
          salaryNumeric: record.job.salaryNumeric,
          experience: record.job.experience,
          skills: record.job.skills,
          description: record.job.description,
          responsibilities: record.job.responsibilities,
          requirements: record.job.requirements,
          createdAt: record.job.createdAt,
        },
      }));

    return res.status(200).json({
      success: true,
      count: activeSavedJobs.length,
      savedJobs: activeSavedJobs,
    });
  } catch (error) {
    console.error("Error fetching saved jobs:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching saved jobs",
    });
  }
};

/**
 * @desc    Save a job for the current authenticated user
 * @route   POST /api/saved-jobs/:jobId
 * @access  Private
 */
const saveJob = async (req, res) => {
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

    // Verify target job exists and is active
    const targetJob = await Job.findOne({ _id: jobId, isActive: true });
    if (!targetJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found or inactive",
      });
    }

    // Check for existing save
    const existingSave = await SavedJob.findOne({ user: userId, job: jobId });
    if (existingSave) {
      return res.status(409).json({
        success: false,
        message: "Job is already in your saved list",
      });
    }

    const newSavedJob = await SavedJob.create({
      user: userId,
      job: jobId,
    });

    return res.status(201).json({
      success: true,
      message: "Job saved successfully",
      savedJob: newSavedJob,
    });
  } catch (error) {
    console.error("Error saving job:", error.message);

    // MongoDB duplicate key error code (compound index safety)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Job is already in your saved list",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while saving job",
    });
  }
};

/**
 * @desc    Unsave/remove a job for the current authenticated user
 * @route   DELETE /api/saved-jobs/:jobId
 * @access  Private
 */
const unsaveJob = async (req, res) => {
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

    // Delete scoped strictly to current user and target job
    const deletedRecord = await SavedJob.findOneAndDelete({
      user: userId,
      job: jobId,
    });

    if (!deletedRecord) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found in your list",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job removed from saved jobs",
    });
  } catch (error) {
    console.error("Error unsaving job:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while removing saved job",
    });
  }
};

module.exports = {
  getSavedJobs,
  saveJob,
  unsaveJob,
};
