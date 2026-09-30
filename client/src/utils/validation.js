export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const NAME_REGEX = /^[a-zA-Z\s'-]+$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,72}$/;

/**
 * Validates login form inputs (email and password existence)
 * Note: Password complexity rules are intentionally not enforced at login
 * to preserve compatibility with existing user accounts.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Object} errors
 */
export function validateLogin(email, password) {
  const errors = {};

  // Email validation
  if (typeof email !== "string" || !email.trim()) {
    errors.email = "Email is required.";
  } else {
    const trimmedEmail = email.trim();
    if (trimmedEmail.length > 254) {
      errors.email = "Email must be 254 characters or fewer.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }
  }

  // Password validation (presence check only for login)
  if (typeof password !== "string" || !password.trim()) {
    errors.password = "Password is required.";
  }

  return errors;
}

/**
 * Validates user registration inputs with strict security constraints
 *
 * @param {Object} data - { name, email, password, confirmPassword }
 * @returns {Object} errors
 */
export function validateRegister(data = {}) {
  const errors = {};

  // 1. NAME VALIDATION
  if (typeof data.name !== "string" || !data.name.trim()) {
    errors.name = "Name is required.";
  } else {
    const trimmedName = data.name.trim();
    if (trimmedName.length < 2) {
      errors.name = "Name must be at least 2 characters.";
    } else if (trimmedName.length > 60) {
      errors.name = "Name must be 60 characters or fewer.";
    } else if (!NAME_REGEX.test(trimmedName)) {
      errors.name =
        "Name can only contain letters, spaces, hyphens, and apostrophes.";
    }
  }

  // 2. EMAIL VALIDATION
  if (typeof data.email !== "string" || !data.email.trim()) {
    errors.email = "Email is required.";
  } else {
    const trimmedEmail = data.email.trim().toLowerCase();
    if (trimmedEmail.length > 254) {
      errors.email = "Email must be 254 characters or fewer.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }
  }

  // 3. PASSWORD VALIDATION
  if (typeof data.password !== "string" || !data.password) {
    errors.password = "Password is required.";
  } else if (!data.password.trim()) {
    errors.password = "Password is required.";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (data.password.length > 72) {
    errors.password = "Password must be 72 characters or fewer.";
  } else if (!/[A-Z]/.test(data.password)) {
    errors.password = "Password must contain at least one uppercase letter.";
  } else if (!/[a-z]/.test(data.password)) {
    errors.password = "Password must contain at least one lowercase letter.";
  } else if (!/\d/.test(data.password)) {
    errors.password = "Password must contain at least one number.";
  } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(data.password)) {
    errors.password = "Password must contain at least one special character.";
  }

  // 4. CONFIRM PASSWORD VALIDATION
  if (typeof data.confirmPassword !== "string" || !data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}