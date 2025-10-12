// utils/sanitizeInput.js
import xss from "xss";
import validator from "validator";

/**
 * Recursively sanitizes strings, arrays, and objects using xss.
 * Also trims whitespace from strings.
 */
export function sanitizeInput(data) {
  if (typeof data === "string") {
    return xss(data.trim());
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeInput(item));
  }

  if (typeof data === "object" && data !== null) {
    const cleanObject = {};
    for (const [key, value] of Object.entries(data)) {
      cleanObject[key] = sanitizeInput(value);
    }
    return cleanObject;
  }

  // For numbers, booleans, etc.
  return data;
}

/**
 * Common validation helpers using validator.js
 */
export const validate = {
  isEmail: (email) => validator.isEmail(email),
  isStrongPassword: (password) =>
    validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
    }),
  isNumeric: (value) => validator.isNumeric(String(value)),
  isLength: (str, min, max) => validator.isLength(str, { min, max }),
};
