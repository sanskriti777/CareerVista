import API_BASE_URL from "../config/api";

export const registerUser = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Registration request error:", error);

    return {
      success: false,
      message: "Unable to connect to server",
    };
  }
};