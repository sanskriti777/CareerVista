export function validateLogin(email, password) {
  let errors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  }

  return errors;
}
export function validateRegister(data) {

  let errors = {};

  if (!data.name.trim()) {
    errors.name = "Name is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  }

  if (!data.password.trim()) {
    errors.password = "Password is required";
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;

}