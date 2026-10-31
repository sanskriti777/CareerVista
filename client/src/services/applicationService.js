import API_BASE_URL from "../config/api";

const APPLICATIONS_API_URL = `${API_BASE_URL}/api/applications`;

/**
 * Helper to retrieve authorization headers with the stored JWT token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch all applications submitted by the current authenticated user
 * @returns {Promise<Object>} API response with { success, count, applications }
 */
export const getApplications = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        status: 401,
        count: 0,
        applications: [],
        message: "No authentication token found",
      };
    }

    const response = await fetch(APPLICATIONS_API_URL, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    return {
      ...data,
      status: response.status,
    };
  } catch (error) {
    console.error("Error fetching applications from API:", error);
    return {
      success: false,
      status: 500,
      count: 0,
      applications: [],
      message: "Unable to connect to server. Please try again later.",
    };
  }
};

/**
 * Submit an application to a specific job
 * @param {string} jobId - Target job MongoDB ObjectId
 * @param {Object} applicationData - { fullName, email, resumeName, notes }
 * @returns {Promise<Object>} API response with { success, message, application }
 */
export const applyToJob = async (jobId, applicationData = {}) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Please log in to submit applications",
      };
    }

    // Explicitly send ONLY the allowed applicant fields (no user, status, appliedAt, or job)
    const sanitizedPayload = {
      fullName: applicationData.fullName ? String(applicationData.fullName).trim() : "",
      email: applicationData.email ? String(applicationData.email).trim() : "",
      resumeName: applicationData.resumeName ? String(applicationData.resumeName).trim() : "",
      notes: applicationData.notes ? String(applicationData.notes).trim() : "",
    };

    const response = await fetch(`${APPLICATIONS_API_URL}/${jobId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(sanitizedPayload),
    });

    const data = await response.json();
    return {
      ...data,
      status: response.status,
    };
  } catch (error) {
    console.error(`Error applying to job ${jobId}:`, error);
    return {
      success: false,
      status: 500,
      message: "Unable to connect to server. Please try again later.",
    };
  }
};

/**
 * Fetch a single application by its ID
 * @param {string} applicationId - Application MongoDB ObjectId
 * @returns {Promise<Object>} API response with { success, application }
 */
export const getApplicationById = async (applicationId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "No authentication token found",
      };
    }

    const response = await fetch(`${APPLICATIONS_API_URL}/${applicationId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    return {
      ...data,
      status: response.status,
    };
  } catch (error) {
    console.error(`Error fetching application ${applicationId}:`, error);
    return {
      success: false,
      status: 500,
      message: "Unable to connect to server. Please try again later.",
    };
  }
};

/**
 * Update an application's status (restricted to employers/administrators)
 * @param {string} applicationId - Application MongoDB ObjectId
 * @param {string} status - New status string
 * @returns {Promise<Object>} API response
 */
export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "No authentication token found",
      };
    }

    const response = await fetch(`${APPLICATIONS_API_URL}/${applicationId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    return {
      ...data,
      status: response.status,
    };
  } catch (error) {
    console.error(`Error updating application status ${applicationId}:`, error);
    return {
      success: false,
      status: 500,
      message: "Unable to connect to server. Please try again later.",
    };
  }
};

/**
 * Withdraw/delete an application
 * @param {string} applicationId - Application MongoDB ObjectId
 * @returns {Promise<Object>} API response
 */
export const withdrawApplication = async (applicationId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "No authentication token found",
      };
    }

    const response = await fetch(`${APPLICATIONS_API_URL}/${applicationId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    return {
      ...data,
      status: response.status,
    };
  } catch (error) {
    console.error(`Error withdrawing application ${applicationId}:`, error);
    return {
      success: false,
      status: 500,
      message: "Unable to connect to server. Please try again later.",
    };
  }
};
