import jwt from "jsonwebtoken";

export const generateAuthToken = (userId: string, username: string): string => {
  return jwt.sign({ _id: userId, username }, process.env.JWT_PRIVATE_TOKEN!, { expiresIn: "7d" });
};
