export const loginUser = async (email, password) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
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

    const response = await fetch("http://localhost:5000/api/auth/me", {
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