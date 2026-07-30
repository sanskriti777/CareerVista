export const loginUser = async (email, password) => {
  console.log("Login Request");

  console.log(email);

  console.log(password);

  return {
    success: true,
    user: {
      name: "Sanskriti",
      email,
    },
  };
};