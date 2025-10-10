import jwt from "jsonwebtoken";

export const generateAuthToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_PRIVATE_TOKEN!, { expiresIn: "7d" });
};
