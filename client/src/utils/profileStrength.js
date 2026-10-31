/**
 * CareerVista Profile Strength Calculation Utility (Client-side)
 *
 * Deterministic 0-100 evaluation of candidate profile completeness.
 * Independent of Job Match Score / Recommendation Readiness.
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MAX_POINTS = {
  name: 5,
  email: 5,
  phone: 5,
  location: 5,
  headline: 5,
  preferredRole: 10,
  bio: 5,
  skills: 15,
  projects: 10,
  resumeUrl: 10,
  education: 15,
  experience: 10,
};

/**
 * Validates whether a string is a safe HTTP or HTTPS URL
 * @param {any} str
 * @returns {boolean}
 */
export const isValidHttpUrl = (str) => {
  if (typeof str !== "string") return false;
  const trimmed = str.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Derives the milestone tier label based on total score
 * @param {number} score
 * @returns {string}
 */
export const getMilestoneTier = (score) => {
  if (score >= 90) return "All-Star Profile";
  if (score >= 75) return "Advanced Profile";
  if (score >= 50) return "Intermediate";
  if (score >= 25) return "Basic Profile";
  return "Getting Started";
};

/**
 * Calculates candidate profile completeness score (0-100)
 *
 * @param {Object} user - The candidate profile object
 * @returns {Object} { score, milestone, breakdown, missing }
 */
export const calculateProfileStrength = (user) => {
  const breakdown = {
    name: 0,
    email: 0,
    phone: 0,
    location: 0,
    headline: 0,
    preferredRole: 0,
    bio: 0,
    skills: 0,
    projects: 0,
    resumeUrl: 0,
    education: 0,
    experience: 0,
  };

  if (!user || typeof user !== "object") {
    return {
      score: 0,
      milestone: "Getting Started",
      breakdown,
      missing: Object.keys(MAX_POINTS),
    };
  }

  // ----------------------------------------------------
  // 1. IDENTITY & CONTACT (20 Points)
  // ----------------------------------------------------
  if (typeof user.name === "string" && user.name.trim().length >= 2) {
    breakdown.name = 5;
  }

  if (
    typeof user.email === "string" &&
    user.email.trim().length > 0 &&
    EMAIL_REGEX.test(user.email.trim())
  ) {
    breakdown.email = 5;
  }

  if (typeof user.phone === "string" && user.phone.trim().length >= 7) {
    breakdown.phone = 5;
  }

  if (typeof user.location === "string" && user.location.trim().length >= 2) {
    breakdown.location = 5;
  }

  // ----------------------------------------------------
  // 2. PROFESSIONAL POSITIONING (20 Points)
  // ----------------------------------------------------
  if (typeof user.headline === "string" && user.headline.trim().length >= 5) {
    breakdown.headline = 5;
  }

  if (
    typeof user.preferredRole === "string" &&
    user.preferredRole.trim().length >= 2
  ) {
    breakdown.preferredRole = 10;
  }

  if (typeof user.bio === "string" && user.bio.trim().length >= 30) {
    breakdown.bio = 5;
  }

  // ----------------------------------------------------
  // 3. TECHNICAL VALIDATION (35 Points)
  // ----------------------------------------------------
  // Skills: 0 -> 0; 1-2 -> 5; 3-4 -> 10; 5+ -> 15
  if (Array.isArray(user.skills)) {
    const validSkillsCount = user.skills.filter(
      (s) => typeof s === "string" && s.trim().length > 0
    ).length;

    if (validSkillsCount >= 5) {
      breakdown.skills = 15;
    } else if (validSkillsCount >= 3) {
      breakdown.skills = 10;
    } else if (validSkillsCount >= 1) {
      breakdown.skills = 5;
    }
  }

  // Projects: Award 10 if >= 1 project with name + description
  if (Array.isArray(user.projects)) {
    const hasValidProject = user.projects.some(
      (p) =>
        p &&
        typeof p === "object" &&
        typeof p.name === "string" &&
        p.name.trim().length > 0 &&
        typeof p.description === "string" &&
        p.description.trim().length > 0
    );

    if (hasValidProject) {
      breakdown.projects = 10;
    }
  }

  // Resume URL: Award 10 if non-empty valid HTTP/HTTPS URL
  if (isValidHttpUrl(user.resumeUrl)) {
    breakdown.resumeUrl = 10;
  }

  // ----------------------------------------------------
  // 4. HISTORY & BACKGROUND (25 Points)
  // ----------------------------------------------------
  // Education: Award 15 if >= 1 education with degree + institution + startYear
  if (Array.isArray(user.education)) {
    const hasValidEducation = user.education.some((edu) => {
      if (!edu || typeof edu !== "object") return false;
      const hasDegree =
        typeof edu.degree === "string" && edu.degree.trim().length > 0;
      const hasInstitution =
        typeof edu.institution === "string" && edu.institution.trim().length > 0;
      const hasStartYear =
        edu.startYear !== undefined &&
        edu.startYear !== null &&
        edu.startYear !== "" &&
        !isNaN(Number(edu.startYear));

      return hasDegree && hasInstitution && hasStartYear;
    });

    if (hasValidEducation) {
      breakdown.education = 15;
    }
  }

  // Experience: Award 10 if >= 1 experience with jobTitle + company OR isFresher === true
  const isFresher = user.isFresher === true;
  let hasValidExperience = false;

  if (Array.isArray(user.experience)) {
    hasValidExperience = user.experience.some(
      (exp) =>
        exp &&
        typeof exp === "object" &&
        typeof exp.jobTitle === "string" &&
        exp.jobTitle.trim().length > 0 &&
        typeof exp.company === "string" &&
        exp.company.trim().length > 0
    );
  }

  if (hasValidExperience || isFresher) {
    breakdown.experience = 10;
  }

  // ----------------------------------------------------
  // TOTAL SCORE & METRICS
  // ----------------------------------------------------
  const rawScore = Object.values(breakdown).reduce((sum, pts) => sum + pts, 0);
  const totalScore = Math.max(0, Math.min(100, Math.round(rawScore)));
  const milestone = getMilestoneTier(totalScore);

  const missing = Object.keys(MAX_POINTS).filter(
    (key) => breakdown[key] < MAX_POINTS[key]
  );

  return {
    score: totalScore,
    milestone,
    breakdown,
    missing,
  };
};

export default calculateProfileStrength;
