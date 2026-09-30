const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Job = require("../models/Job");

const now = Date.now();
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const sampleJobs = [
  {
    title: "Frontend Developer",
    company: "Google",
    location: "Bangalore",
    type: "Full Time",
    salary: "$1,500/month",
    salaryNumeric: 1500,
    experience: "1-3 Years",
    skills: ["React", "JavaScript", "CSS"],
    description:
      "Google is looking for a Frontend Developer who can build responsive and scalable web applications using modern React technologies.",
    responsibilities: [
      "Develop responsive user interfaces.",
      "Collaborate with backend developers.",
      "Write clean and reusable React components.",
      "Fix bugs and optimize application performance.",
    ],
    requirements: [
      "Strong knowledge of React.",
      "Good understanding of JavaScript.",
      "Experience with Git.",
      "Basic knowledge of REST APIs.",
    ],
    postedBy: null,
    isActive: true,
    createdAt: new Date(now - 2 * ONE_DAY_MS), // 2 Days Ago
  },
  {
    title: "React Developer",
    company: "Microsoft",
    location: "Hyderabad",
    type: "Internship",
    salary: "$1,000/month",
    salaryNumeric: 1000,
    experience: "Fresher",
    skills: ["React", "Redux", "Git"],
    description:
      "Microsoft is hiring React Interns to build high-quality frontend applications while working with experienced developers.",
    responsibilities: [
      "Build reusable React components.",
      "Fix frontend bugs.",
      "Participate in code reviews.",
      "Work with UI designers.",
    ],
    requirements: [
      "Basic React knowledge.",
      "Understanding of JavaScript.",
      "Git basics.",
      "Good communication skills.",
    ],
    postedBy: null,
    isActive: true,
    createdAt: new Date(now - 1 * ONE_DAY_MS), // 1 Day Ago
  },
  {
    title: "Node.js Developer",
    company: "Amazon",
    location: "Pune",
    type: "Full Time",
    salary: "$1,800/month",
    salaryNumeric: 1800,
    experience: "2-4 Years",
    skills: ["Node.js", "Express", "MongoDB"],
    description:
      "Amazon is looking for a backend developer to build scalable REST APIs using Node.js and MongoDB.",
    responsibilities: [
      "Develop REST APIs.",
      "Maintain MongoDB database.",
      "Improve backend performance.",
      "Collaborate with frontend developers.",
    ],
    requirements: [
      "Strong Node.js knowledge.",
      "Express.js experience.",
      "MongoDB experience.",
      "Git and Postman knowledge.",
    ],
    postedBy: null,
    isActive: true,
    createdAt: new Date(now), // Today
  },
  {
    title: "Software Engineer",
    company: "Adobe",
    location: "Noida",
    type: "Hybrid",
    salary: "$1,700/month",
    salaryNumeric: 1700,
    experience: "1-2 Years",
    skills: ["Java", "SQL", "Git"],
    description:
      "Adobe is looking for Software Engineers to develop enterprise-level software applications.",
    responsibilities: [
      "Develop software modules.",
      "Write efficient code.",
      "Perform debugging.",
      "Work with QA teams.",
    ],
    requirements: [
      "Strong Java knowledge.",
      "SQL database understanding.",
      "Git experience.",
      "Problem-solving skills.",
    ],
    postedBy: null,
    isActive: true,
    createdAt: new Date(now - 3 * ONE_DAY_MS), // 3 Days Ago
  },
];

const seedJobs = async () => {
  try {
    await connectDB();

    let insertedCount = 0;
    let skippedCount = 0;

    for (const jobData of sampleJobs) {
      // Idempotent duplicate check: title and company
      const existingJob = await Job.findOne({
        title: jobData.title,
        company: jobData.company,
      });

      if (existingJob) {
        console.log(`Skipped: ${jobData.title} at ${jobData.company} (already exists)`);
        skippedCount++;
      } else {
        await Job.create(jobData);
        console.log(`Inserted: ${jobData.title} at ${jobData.company}`);
        insertedCount++;
      }
    }

    console.log("-----------------------------------------");
    console.log("Job Seeding Summary:");
    console.log(`Inserted: ${insertedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log("-----------------------------------------");

    await mongoose.connection.close();
    console.log("Database connection closed cleanly.");
    process.exit(0);
  } catch (error) {
    console.error("Error during job seed:", error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

// Only execute when run directly from command line
if (require.main === module) {
  seedJobs();
}

module.exports = seedJobs;
