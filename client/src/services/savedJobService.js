import API_BASE_URL from "../config/api";

const SAVED_JOBS_API_URL = `${API_BASE_URL}/api/saved-jobs`;

/**
 * Helper to get the auth header using the stored JWT token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch all saved jobs for the current authenticated user
 * @returns {Promise<Object>} API response with { success, count, savedJobs }
 */
export const getSavedJobs = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        count: 0,
        savedJobs: [],
        message: "No authentication token found",
      };
    }

    const response = await fetch(SAVED_JOBS_API_URL, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching saved jobs from API:", error);
    return {
      success: false,
      count: 0,
      savedJobs: [],
      message: "Unable to connect to server. Please try again later.",
    };
  }
};

/**
 * Save a job for the current authenticated user
 * @param {string} jobId - MongoDB ObjectId of the target job
 * @returns {Promise<Object>} API response
 */
export const saveJob = async (jobId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Please log in to save jobs",
      };
    }

    const response = await fetch(`${SAVED_JOBS_API_URL}/${jobId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    return {
      ...data,
      status: response.status,
    };
  } catch (error) {
    console.error(`Error saving job ${jobId}:`, error);
    return {
      success: false,
      status: 500,
      message: "Unable to connect to server. Please try again later.",
    };
  }
};

/**
 * Unsave/remove a job for the current authenticated user
 * @param {string} jobId - MongoDB ObjectId of the target job
 * @returns {Promise<Object>} API response
 */
export const unsaveJob = async (jobId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Please log in to remove saved jobs",
      };
    }

    const response = await fetch(`${SAVED_JOBS_API_URL}/${jobId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    return {
      ...data,
      status: response.status,
    };
  } catch (error) {
    console.error(`Error removing saved job ${jobId}:`, error);
    return {
      success: false,
      status: 500,
      message: "Unable to connect to server. Please try again later.",
    };
  }
};
