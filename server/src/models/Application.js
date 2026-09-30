const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job reference is required"],
      index: true,
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },

    resumeName: {
      type: String,
      default: "",
      trim: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: {
        values: [
          "Submitted",
          "Applied",
          "Under Review",
          "Shortlisted",
          "Rejected",
          "Selected",
        ],
        message: "{VALUE} is not a valid application status",
      },
      default: "Submitted",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring a user can only apply once per job
applicationSchema.index(
  { user: 1, job: 1 },
  { unique: true }
);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
