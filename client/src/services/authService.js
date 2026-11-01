import API_BASE_URL from "../config/api";

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error("Login request error:", error);

    return {
      success: false,
      message: "Unable to connect to server",
    };
  }
};

export const updateProfile = async (profileData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please log in again.",
      };
    }

    // Only allow specific editable fields
    const allowedPayload = {};
    if (profileData.name !== undefined) allowedPayload.name = profileData.name;
    if (profileData.phone !== undefined) allowedPayload.phone = profileData.phone;
    if (profileData.location !== undefined) allowedPayload.location = profileData.location;
    if (profileData.headline !== undefined) allowedPayload.headline = profileData.headline;
    if (profileData.preferredRole !== undefined) allowedPayload.preferredRole = profileData.preferredRole;
    if (profileData.skills !== undefined) allowedPayload.skills = profileData.skills;
    if (profileData.resumeUrl !== undefined) allowedPayload.resumeUrl = profileData.resumeUrl;
    if (profileData.bio !== undefined) allowedPayload.bio = profileData.bio;
    if (profileData.isFresher !== undefined) allowedPayload.isFresher = profileData.isFresher;
    if (profileData.education !== undefined) allowedPayload.education = profileData.education;
    if (profileData.experience !== undefined) allowedPayload.experience = profileData.experience;
    if (profileData.projects !== undefined) allowedPayload.projects = profileData.projects;

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(allowedPayload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Profile update request error:", error);

    return {
      success: false,
      message: error.message || "Unable to connect to server",
    };
  }
};

export const uploadProfilePicture = async (file) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please log in again.",
      };
    }

    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await fetch(`${API_BASE_URL}/api/auth/profile-picture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Profile picture upload error:", error);

    return {
      success: false,
      message: error.message || "Unable to upload profile picture",
    };
  }
};

export const deleteProfilePicture = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        success: false,
        message: "No authentication token found. Please log in again.",
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/profile-picture`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Profile picture delete error:", error);

    return {
      success: false,
      message: error.message || "Unable to remove profile picture",
    };
  }
};

/**
 * Requests a password reset email for the given account email
 *
 * @param {string} email
 * @returns {Promise<{ success: boolean, message: string, devResetUrl?: string }>}
 */
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Forgot password request error:", error);
    return {
      success: false,
      message: "Unable to connect to server. Please check your connection.",
    };
  }
};

/**
 * Submits a new password along with the single-use reset token
 *
 * @param {string} token
 * @param {string} password
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Reset password request error:", error);
    return {
      success: false,
      message: "Unable to connect to server. Please check your connection.",
    };
  }
};