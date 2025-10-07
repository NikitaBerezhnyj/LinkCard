import bcrypt from "bcryptjs";

export const isValidPassword = (password: unknown): password is string => {
  return typeof password === "string" && password.length > 0;
};

export const getSaltRounds = (): number | { status: number; message: string } => {
  const saltEnv = process.env.SALT || "10";
  const saltRounds = parseInt(saltEnv, 10);

  if (isNaN(saltRounds) || saltRounds < 1 || saltRounds > 31) {
    console.error("Invalid SALT value:", saltRounds);
    return { status: 500, message: "Server configuration error: invalid SALT" };
  }

  return saltRounds;
};

export const hashUserPassword = async (
  password: string,
  saltRounds: number
): Promise<string | null> => {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (err) {
    console.error("Error hashing password:", err);
    return null;
  }
};
