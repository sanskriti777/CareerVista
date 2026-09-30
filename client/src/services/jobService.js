const API_BASE_URL = "http://localhost:5000/api/jobs";

/**
 * Fetch all active jobs with optional search, filters, and sorting
 * @param {Object} params - { search, location, type, experience, sort }
 * @returns {Promise<Object>} API response with { success, count, jobs }
 */
export const getJobs = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.search && params.search.trim()) {
      queryParams.append("search", params.search.trim());
    }
    if (params.location && params.location.trim()) {
      queryParams.append("location", params.location.trim());
    }
    if (params.type && params.type.trim()) {
      queryParams.append("type", params.type.trim());
    }
    if (params.experience && params.experience.trim()) {
      queryParams.append("experience", params.experience.trim());
    }
    if (params.sort && params.sort.trim()) {
      queryParams.append("sort", params.sort.trim());
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${API_BASE_URL}?${queryString}` : API_BASE_URL;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching jobs from API:", error);
    return {
      success: false,
      count: 0,
      jobs: [],
      message: "Unable to connect to server. Please try again later.",
    };
  }
};

/**
 * Fetch a single job by its ID
 * @param {string} jobId - MongoDB ObjectId
 * @returns {Promise<Object>} API response with { success, job }
 */
export const getJobById = async (jobId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${jobId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching job ${jobId}:`, error);
    return {
      success: false,
      message: "Unable to connect to server. Please try again later.",
    };
  }
};
