const mongoose = require("mongoose");
const Job = require("../models/Job");

/**
 * Helper to escape special regex characters for safe query matching
 */
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

/**
 * @desc    Get all active jobs with optional search, filters, and sorting
 * @route   GET /api/jobs
 * @access  Public
 */
const getAllJobs = async (req, res) => {
  try {
    const { search, location, type, experience, sort } = req.query;

    const query = { isActive: true };

    // Search filter across title, company, location, and skills
    if (search && search.trim()) {
      const safeSearch = escapeRegex(search.trim());
      const searchRegex = new RegExp(safeSearch, "i");

      query.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { location: searchRegex },
        { skills: searchRegex },
      ];
    }

    // Exact location filter (case-insensitive)
    if (location && location.trim()) {
      const safeLocation = escapeRegex(location.trim());
      query.location = new RegExp(`^${safeLocation}$`, "i");
    }

    // Exact job type filter (case-insensitive)
    if (type && type.trim()) {
      const safeType = escapeRegex(type.trim());
      query.type = new RegExp(`^${safeType}$`, "i");
    }

    // Exact experience filter (case-insensitive)
    if (experience && experience.trim()) {
      const safeExp = escapeRegex(experience.trim());
      query.experience = new RegExp(`^${safeExp}$`, "i");
    }

    // Sorting configuration
    let sortOptions = { createdAt: -1 }; // Default: latest first

    if (sort === "salary-high") {
      sortOptions = { salaryNumeric: -1, createdAt: -1 };
    } else if (sort === "company-az") {
      sortOptions = { company: 1, createdAt: -1 };
    } else if (sort === "latest") {
      sortOptions = { createdAt: -1 };
    }

    const jobs = await Job.find(query).sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching jobs",
    });
  }
};

/**
 * @desc    Get a single active job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID format",
      });
    }

    const job = await Job.findOne({ _id: id, isActive: true });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Error fetching job by ID:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching job details",
    });
  }
};

/**
 * @desc    Create a new job posting
 * @route   POST /api/jobs
 * @access  Private (Authenticated users)
 */
const createJob = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const {
      title,
      company,
      location,
      type,
      salary,
      salaryNumeric,
      experience,
      skills,
      description,
      responsibilities,
      requirements,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !company ||
      !location ||
      !type ||
      !salary ||
      !experience ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: title, company, location, type, salary, experience, description",
      });
    }

    // Determine numeric salary for sorting
    let numSalary = Number(salaryNumeric);
    if (!numSalary || isNaN(numSalary)) {
      const extracted = Number(String(salary).replace(/[^0-9]/g, ""));
      numSalary = isNaN(extracted) ? 0 : extracted;
    }

    const newJob = await Job.create({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      type: type.trim(),
      salary: salary.trim(),
      salaryNumeric: numSalary,
      experience: experience.trim(),
      skills: Array.isArray(skills) ? skills : [],
      description: description.trim(),
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      postedBy: userId || null,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Error creating job:", error.message);

    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while creating job",
    });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
};
