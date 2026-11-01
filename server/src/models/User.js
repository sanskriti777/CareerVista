const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
    {
        degree: {
            type: String,
            required: [true, "Degree is required"],
            trim: true,
            minlength: [2, "Degree must be at least 2 characters"],
            maxlength: [100, "Degree must not exceed 100 characters"],
        },
        institution: {
            type: String,
            required: [true, "Institution is required"],
            trim: true,
            minlength: [2, "Institution must be at least 2 characters"],
            maxlength: [150, "Institution must not exceed 150 characters"],
        },
        fieldOfStudy: {
            type: String,
            trim: true,
            maxlength: [100, "Field of study must not exceed 100 characters"],
            default: "",
        },
        startYear: {
            type: Number,
            required: [true, "Start year is required"],
            min: [1960, "Start year must be at or after 1960"],
            max: [2100, "Start year must be at or before 2100"],
        },
        endYear: {
            type: Number,
            min: [1960, "End year must be at or after 1960"],
            max: [2100, "End year must be at or before 2100"],
            default: null,
        },
        currentlyStudying: {
            type: Boolean,
            default: false,
        },
    },
    { _id: true }
);

const experienceSchema = new mongoose.Schema(
    {
        jobTitle: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
            minlength: [2, "Job title must be at least 2 characters"],
            maxlength: [100, "Job title must not exceed 100 characters"],
        },
        company: {
            type: String,
            required: [true, "Company is required"],
            trim: true,
            minlength: [2, "Company must be at least 2 characters"],
            maxlength: [150, "Company must not exceed 150 characters"],
        },
        employmentType: {
            type: String,
            enum: {
                values: [
                    "Full Time",
                    "Part Time",
                    "Internship",
                    "Contract",
                    "Freelance",
                ],
                message: "{VALUE} is not a supported employment type",
            },
            default: "Full Time",
        },
        startDate: {
            type: String,
            required: [true, "Start date is required"],
            trim: true,
        },
        endDate: {
            type: String,
            trim: true,
            default: "",
        },
        currentlyWorking: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, "Description must not exceed 1000 characters"],
            default: "",
        },
    },
    { _id: true }
);

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Project name is required"],
            trim: true,
            minlength: [2, "Project name must be at least 2 characters"],
            maxlength: [120, "Project name must not exceed 120 characters"],
        },
        description: {
            type: String,
            required: [true, "Project description is required"],
            trim: true,
            minlength: [10, "Project description must be at least 10 characters"],
            maxlength: [600, "Project description must not exceed 600 characters"],
        },
        technologies: {
            type: [String],
            default: [],
        },
        projectUrl: {
            type: String,
            trim: true,
            default: "",
        },
        githubUrl: {
            type: String,
            trim: true,
            default: "",
        },
    },
    { _id: true }
);

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"],
        },

        role: {
            type: String,
            enum: ["jobseeker", "employer", "admin"],
            default: "jobseeker",
        },

        phone: {
            type: String,
            default: "",
        },

        location: {
            type: String,
            default: "",
        },

        headline: {
            type: String,
            default: "",
        },

        preferredRole: {
            type: String,
            default: "",
        },

        skills: {
            type: [String],
            default: [],
        },

        resumeUrl: {
            type: String,
            default: "",
        },

        profilePicture: {
            type: String,
            trim: true,
            default: "",
        },

        bio: {
            type: String,
            trim: true,
            maxlength: [1500, "Bio must not exceed 1500 characters"],
            default: "",
        },

        isFresher: {
            type: Boolean,
            default: false,
        },

        education: {
            type: [educationSchema],
            default: [],
        },

        experience: {
            type: [experienceSchema],
            default: [],
        },

        projects: {
            type: [projectSchema],
            default: [],
        },

        resetPasswordToken: {
            type: String,
            default: undefined,
        },

        resetPasswordExpire: {
            type: Date,
            default: undefined,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;