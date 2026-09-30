/**
 * CareerVista Rule-Based Job Matching & Recommendation Engine
 *
 * VIVA & SYSTEM DOCUMENTATION:
 * The matching engine is 100% deterministic and explainable, computing similarity
 * on a transparent 0-100 point scale using real candidate profile data and real MongoDB job data.
 *
 * Weight Distribution:
 * 1. Skills Match (60 Points Max / 60% Weight):
 *    - Compares candidate skills against required job skills.
 *    - Normalization: lowercased, trimmed, whitespace-normalized, deduplicated.
 *    - Formula: (Count of Matched Skills / Total Job Skills) * 60.
 *    - If candidate has no skills: 0 points.
 *    - If job specifies no explicit skills: neutral 30 points.
 *
 * 2. Preferred Role Alignment (25 Points Max / 25% Weight):
 *    - Compares candidate preferredRole (or headline fallback) with job title.
 *    - Keyword/token overlap & substring comparison.
 *    - Full match: 25 points.
 *    - Partial significant keyword match: proportional (minimum 15 points).
 *    - If candidate has no preferred role: 0 points.
 *
 * 3. Location Compatibility (15 Points Max / 15% Weight):
 *    - Compares candidate location with job location.
 *    - If job is "Remote" or candidate is "Remote": 15 points.
 *    - If candidate specifies no location preference: 15 points (non-penalizing for open candidates).
 *    - If locations match: 15 points.
 *    - If on-site locations mismatch: 0 points.
 *
 * Total Score = Skills Score + Role Score + Location Score (Range: 0 - 100).
 *
 * Score Bands:
 * - 80 – 100: "Strong Match"
 * - 60 – 79:  "Good Match"
 * - 40 – 59:  "Partial Match"
 * -  0 – 39:  "Low Match"
 */

/**
 * Normalizes a string by converting to lowercase, trimming, and cleaning spaces
 * @param {string} str
 * @returns {string}
 */
export const normalizeString = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.toLowerCase().trim();
};

/**
 * Tokenizes text into lowercase words, stripping punctuation
 * @param {string} text
 * @returns {string[]}
 */
export const tokenizeText = (text) => {
  if (!text || typeof text !== "string") return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
};

/**
 * Calculates a match score between a candidate profile and a job listing
 * @param {Object} user - The candidate profile from AuthContext
 * @param {Object} job - The job document from MongoDB
 * @returns {Object} Match breakdown, scores, and labels
 */
export const getJobMatchScore = (user, job) => {
  if (!job) {
    return {
      score: 0,
      label: "Low Match",
      skillsScore: 0,
      roleScore: 0,
      locationScore: 0,
      matchedSkills: [],
      missingSkills: [],
      totalJobSkills: 0,
      roleMatch: false,
      locationMatch: false,
    };
  }

  // ----------------------------------------------------
  // 1. SKILLS MATCH (60 Points Max)
  // ----------------------------------------------------
  const rawUserSkills = Array.isArray(user?.skills) ? user.skills : [];
  const normalizedUserSkills = rawUserSkills
    .map((s) => (typeof s === "string" ? s.toLowerCase().trim() : ""))
    .filter(Boolean);
  const userSkillSet = new Set(normalizedUserSkills);

  const rawJobSkills = Array.isArray(job.skills) ? job.skills : [];
  const normalizedJobSkills = Array.from(
    new Set(
      rawJobSkills
        .map((s) => (typeof s === "string" ? s.toLowerCase().trim() : ""))
        .filter(Boolean)
    )
  );

  const matchedSkills = [];
  const missingSkills = [];

  normalizedJobSkills.forEach((jobSkill) => {
    // Check direct equality or substring inclusion (e.g., "react" in "react.js" or vice-versa)
    const isMatched = Array.from(userSkillSet).some(
      (userSkill) =>
        userSkill === jobSkill ||
        userSkill.includes(jobSkill) ||
        jobSkill.includes(userSkill)
    );

    if (isMatched) {
      matchedSkills.push(jobSkill);
    } else {
      missingSkills.push(jobSkill);
    }
  });

  let skillsScore = 0;
  if (normalizedJobSkills.length > 0) {
    if (normalizedUserSkills.length > 0) {
      const matchRatio = matchedSkills.length / normalizedJobSkills.length;
      skillsScore = Math.round(matchRatio * 60);
    } else {
      skillsScore = 0;
    }
  } else if (normalizedUserSkills.length > 0) {
    // If job does not list skills but user has profile skills, award neutral half
    skillsScore = 30;
  }

  // ----------------------------------------------------
  // 2. PREFERRED ROLE MATCH (25 Points Max)
  // ----------------------------------------------------
  const userRole = normalizeString(user?.preferredRole || user?.headline || "");
  const jobTitle = normalizeString(job.title || "");

  let roleScore = 0;
  let roleMatch = false;

  if (userRole && jobTitle) {
    const userRoleTokens = tokenizeText(userRole);
    const jobTitleTokens = tokenizeText(jobTitle);

    // Exact or direct substring match
    if (jobTitle.includes(userRole) || userRole.includes(jobTitle)) {
      roleScore = 25;
      roleMatch = true;
    } else {
      // Token overlap (e.g., "Frontend Developer" vs "Senior Frontend Engineer")
      const commonTokens = userRoleTokens.filter(
        (token) => jobTitleTokens.includes(token) || jobTitle.includes(token)
      );

      if (commonTokens.length > 0) {
        const ratio = commonTokens.length / userRoleTokens.length;
        roleScore = Math.max(15, Math.round(ratio * 25));
        roleMatch = true;
      }
    }
  }

  // ----------------------------------------------------
  // 3. LOCATION COMPATIBILITY (15 Points Max)
  // ----------------------------------------------------
  const userLocation = normalizeString(user?.location || "");
  const jobLocation = normalizeString(job.location || "");
  const jobType = normalizeString(job.type || "");

  let locationScore = 0;
  let locationMatch = false;

  const isRemote =
    jobLocation.includes("remote") ||
    jobType.includes("remote") ||
    userLocation.includes("remote");

  if (isRemote) {
    locationScore = 15;
    locationMatch = true;
  } else if (!userLocation) {
    // Candidates who did not specify a location constraint are not penalized
    locationScore = 15;
    locationMatch = true;
  } else if (
    jobLocation &&
    (jobLocation.includes(userLocation) || userLocation.includes(jobLocation))
  ) {
    locationScore = 15;
    locationMatch = true;
  } else {
    locationScore = 0;
    locationMatch = false;
  }

  // ----------------------------------------------------
  // TOTAL SCORE & LABEL DERIVATION
  // ----------------------------------------------------
  const totalScore = Math.min(
    100,
    Math.max(0, skillsScore + roleScore + locationScore)
  );

  let label = "Low Match";
  if (totalScore >= 80) {
    label = "Strong Match";
  } else if (totalScore >= 60) {
    label = "Good Match";
  } else if (totalScore >= 40) {
    label = "Partial Match";
  } else {
    label = "Low Match";
  }

  return {
    score: totalScore,
    label,
    skillsScore,
    roleScore,
    locationScore,
    matchedSkills,
    missingSkills,
    totalJobSkills: normalizedJobSkills.length,
    roleMatch,
    locationMatch,
  };
};

/**
 * Filters and ranks jobs against the user's profile, sorted by match score descending
 * @param {Object} user - Authenticated user object
 * @param {Array} jobs - List of MongoDB jobs
 * @param {number} [limit=5] - Maximum number of recommendations
 * @returns {Array} List of { job, match }
 */
export const getRecommendedJobs = (user, jobs = [], limit = 5) => {
  if (!Array.isArray(jobs) || jobs.length === 0) return [];

  const scoredJobs = jobs.map((job) => ({
    job,
    match: getJobMatchScore(user, job),
  }));

  // Sort descending by score; secondary sort by newest
  scoredJobs.sort((a, b) => {
    if (b.match.score !== a.match.score) {
      return b.match.score - a.match.score;
    }
    return new Date(b.job.createdAt || 0) - new Date(a.job.createdAt || 0);
  });

  return typeof limit === "number" && limit > 0
    ? scoredJobs.slice(0, limit)
    : scoredJobs;
};

/**
 * Checks whether user has entered sufficient profile criteria for meaningful matching
 * @param {Object} user
 * @returns {boolean}
 */
export const hasSufficientProfileData = (user) => {
  if (!user) return false;
  const hasSkills = Array.isArray(user.skills) && user.skills.length > 0;
  const hasRole = Boolean(user.preferredRole && user.preferredRole.trim());
  const hasLocation = Boolean(user.location && user.location.trim());
  return hasSkills || hasRole || hasLocation;
};
