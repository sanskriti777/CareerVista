const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },

    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },

    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
    },

    type: {
      type: String,
      required: [true, "Job type is required"],
      enum: {
        values: [
          "Full Time",
          "Internship",
          "Hybrid",
          "Part Time",
          "Remote",
        ],
        message: "{VALUE} is not a supported job type",
      },
      default: "Full Time",
    },

    salary: {
      type: String,
      required: [true, "Salary display string is required"],
      trim: true,
    },

    salaryNumeric: {
      type: Number,
      default: 0,
      min: 0,
    },

    experience: {
      type: String,
      required: [true, "Experience level is required"],
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    requirements: {
      type: [String],
      default: [],
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for keyword search across primary job attributes
jobSchema.index({
  title: "text",
  company: "text",
  location: "text",
  skills: "text",
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
