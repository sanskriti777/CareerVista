const express = require("express");
const {
  getMyApplications,
  applyToJob,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Enforce authentication across all application tracking endpoints
router.use(protect);

router.get("/", getMyApplications);
router.post("/:jobId", applyToJob);
router.get("/:id", getApplicationById);
router.put("/:id", updateApplicationStatus);
router.delete("/:id", withdrawApplication);

module.exports = router;
