const express = require("express");
const {
  getSavedJobs,
  saveJob,
  unsaveJob,
} = require("../controllers/savedJobController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Enforce authentication across all saved job routes
router.use(protect);

router.get("/", getSavedJobs);
router.post("/:jobId", saveJob);
router.delete("/:jobId", unsaveJob);

module.exports = router;
