import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { _id: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const cookieToken = req.cookies?.token;
  const header = req.headers.authorization;
  const headerToken = header && header.startsWith("Bearer ") ? header.split(" ")[1] : undefined;
  const token = cookieToken || headerToken;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const secret = process.env.JWT_PRIVATE_TOKEN;
  if (!secret) {
    res.status(500).json({ message: "Server misconfiguration" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    req.user = { _id: decoded.userId };
    next();
  } catch (err: unknown) {
    console.error("JWT verification failed:", err);
    res.status(403).json({ message: "Invalid token" });
  }
};
