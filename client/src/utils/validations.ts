const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export const validateUsername = (username: string): string | null => {
  if (!username) return "Username is required.";
  if (!usernameRegex.test(username))
    return "Username must be 3–20 characters and contain only letters, numbers, or underscores.";
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required.";
  if (!emailRegex.test(email)) return "Please enter a valid email address.";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required.";
  if (!passwordRegex.test(password))
    return "Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.";
  return null;
};
