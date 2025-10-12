import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Request, RequestHandler, Response } from "express";
import { transporter } from "../config/mailConfig";
import { ResetToken } from "../models/resetTokenModel";
import { User, IUser } from "../models/userModel";
import {
  validateRegistration,
  validateLogin,
  validatePassword
} from "../validators/userValidation";
import { generateAuthToken } from "../utils/jwtHelper";
import { isValidPassword, getSaltRounds, hashUserPassword } from "../utils/passwordUtils";
import { deepMerge } from "../utils/deepMerge";
import { AuthRequest } from "../middleware/authMiddleware";

dotenv.config();

const makeCookieOptions = () => ({
  httpOnly: true,
  secure: false, // коли перейдемо на prod треба поставити true
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000
});

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  const checkUserConflict = async (
    email: string,
    username: string
  ): Promise<{ status: number; message: string } | null> => {
    const [emailExists, usernameExists] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ username })
    ]);

    if (emailExists) return { status: 409, message: "User with given email already exists!" };
    if (usernameExists) return { status: 409, message: "User with given username already exists!" };
    return null;
  };

  try {
    const { error } = validateRegistration(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, username, password } = req.body;

    if (!isValidPassword(password)) {
      return res.status(400).json({ message: "Password must be a non-empty string" });
    }

    const conflict = await checkUserConflict(email, username);
    if (conflict) return res.status(conflict.status).json({ message: conflict.message });

    const saltRounds = getSaltRounds();
    if (typeof saltRounds !== "number") {
      return res.status(saltRounds.status).json({ message: saltRounds.message });
    }

    const hashedPassword = await hashUserPassword(password, saltRounds);
    if (!hashedPassword) return res.status(500).json({ message: "Error hashing password" });

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      links: [{ title: "Email", url: email }]
    });

    await newUser.save();

    const token = generateAuthToken(newUser.id.toString());

    const origin = req.headers.origin as string | undefined;
    const isBrowser = origin && origin.includes(process.env.ORIGIN_WEBSITE || "");

    if (isBrowser) {
      res.cookie("token", token, makeCookieOptions());
      return res
        .status(201)
        .json({ username: newUser.username, message: "User created successfully" });
    }

    return res
      .status(201)
      .json({ token, username: newUser.username, message: "User created successfully" });
  } catch (err) {
    console.error("=== Error during user registration ===", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err instanceof Error ? err.message : String(err)
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid Email or Password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid Email or Password" });

    const token = generateAuthToken(user.id.toString());

    const origin = req.headers.origin as string | undefined;
    const isBrowser = origin && origin.includes(process.env.ORIGIN_WEBSITE || "");

    if (isBrowser) {
      res.cookie("token", token, makeCookieOptions());
      return res.status(200).json({ username: user.username, message: "Logged in successfully" });
    }

    return res
      .status(200)
      .json({ token, username: user.username, message: "Logged in successfully" });
  } catch (err) {
    console.error("Error during user login:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    await ResetToken.create({ token: resetToken, userId: user._id });

    const resetURL = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      text: `You requested a password reset. Click this link: ${resetURL}`
    });

    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return res.status(500).json({ message: "Error sending password reset email" });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  const { password } = req.body;
  const { token } = req.params;

  if (!password) return res.status(400).json({ message: "Password is required" });

  const { error } = validatePassword(password);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const resetToken = await ResetToken.findOne({ token });
    if (!resetToken) return res.status(400).json({ message: "Invalid or expired token" });

    const user = await User.findById(resetToken.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword)
      return res.status(400).json({ message: "New password must differ from current one." });

    const saltRounds = getSaltRounds();
    if (typeof saltRounds !== "number") {
      return res.status(saltRounds.status).json({ message: saltRounds.message });
    }

    const hashedPassword = await hashUserPassword(password, saltRounds);
    if (!hashedPassword) return res.status(500).json({ message: "Error hashing password" });

    user.password = hashedPassword;
    await user.save();
    await resetToken.deleteOne();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Error resetting password" });
  }
};

export const logoutUser: RequestHandler = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error during logout:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user._id).select(
      "_id username email avatar bio links styles"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    return res.status(500).json({ message: "Error retrieving profile" });
  }
};

export const getUser = async (req: Request, res: Response): Promise<Response> => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        links: user.links,
        styles: user.styles
      },
      message: "User info sent successfully"
    });
  } catch (error) {
    console.error("Error retrieving user info:", error);
    return res.status(500).json({ message: "Error retrieving user info" });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { username } = req.params;

  const updates: Partial<IUser> = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.user?._id !== user.id.toString()) {
      return res.status(403).json({ message: "Forbidden: cannot edit other user's profile" });
    }

    const allowedFields: (keyof IUser)[] = [
      "username",
      "email",
      "avatar",
      "bio",
      "links",
      "styles"
    ];
    const filteredUpdates: Partial<IUser> = {};

    for (const key of allowedFields) {
      if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
    }

    deepMerge(user, filteredUpdates);

    await user.save();

    return res.status(200).json({ message: "User updated successfully", data: user });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Error updating user" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<Response> => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.user?._id !== user.id.toString()) {
      return res.status(403).json({ message: "Forbidden: cannot delete other user's profile" });
    }

    await User.deleteOne({ _id: user._id });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Error deleting user" });
  }
};
