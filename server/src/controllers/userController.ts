import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Request, Response } from "express";
import { transporter } from "../config/mailConfig";
import { ResetToken } from "../models/resetTokenModel";
import { User } from "../models/userModel";
import {
  validateRegistration,
  validateLogin,
  validatePassword
} from "../validators/userValidation";
import { generateAuthToken } from "../utils/jwtHelper";
import { isValidPassword, getSaltRounds, hashUserPassword } from "../utils/passwordUtils";
import { deepMerge } from "../utils/deepMerge";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  RegisterUserDTO,
  LoginUserDTO,
  ResetPasswordDTO,
  UpdateUserDTO
} from "../types/ApiRequests";
import { ApiResponse, AuthResponse, UserResponse } from "../types/ApiResponse";

dotenv.config();

const makeCookieOptions = () => ({
  httpOnly: true,
  secure: false, // коли перейдемо на prod треба поставити true
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000
});

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body: RegisterUserDTO = req.body;
    const { error } = validateRegistration(body);

    if (error) {
      const response: ApiResponse<null> = { message: error.details[0].message };
      return res.status(400).json(response);
    }

    const { email, username, password } = body;

    if (!isValidPassword(password)) {
      const response: ApiResponse<null> = { message: "Password must be a non-empty string" };
      return res.status(400).json(response);
    }

    const [emailExists, usernameExists] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ username })
    ]);

    if (emailExists) {
      const response: ApiResponse<null> = { message: "User with given email already exists!" };
      return res.status(409).json(response);
    }

    if (usernameExists) {
      const response: ApiResponse<null> = { message: "User with given username already exists!" };
      return res.status(409).json(response);
    }

    const saltRounds = getSaltRounds();
    if (typeof saltRounds !== "number") {
      const response: ApiResponse<null> = { message: saltRounds.message || "Invalid salt rounds" };
      return res.status(saltRounds.status || 500).json(response);
    }

    const hashedPassword = await hashUserPassword(password, saltRounds);
    if (!hashedPassword) {
      const response: ApiResponse<null> = { message: "Error hashing password" };
      return res.status(500).json(response);
    }

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
      const response: AuthResponse = {
        message: "User created successfully",
        data: { username: newUser.username }
      };
      return res.status(201).json(response);
    }

    const response: AuthResponse = {
      message: "User created successfully",
      token,
      data: { username: newUser.username }
    };
    return res.status(201).json(response);
  } catch (err) {
    console.error("=== Error during user registration ===", err);
    const response: ApiResponse<null> = {
      message: "Internal Server Error"
    };
    return res.status(500).json(response);
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body: LoginUserDTO = req.body;
    const { error } = validateLogin(body);

    if (error) {
      const response: ApiResponse<null> = { message: error.details[0].message };
      return res.status(400).json(response);
    }

    const { email, password } = body;
    const user = await User.findOne({ email });

    if (!user) {
      const response: ApiResponse<null> = { message: "Invalid Email or Password" };
      return res.status(401).json(response);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const response: ApiResponse<null> = { message: "Invalid Email or Password" };
      return res.status(401).json(response);
    }

    const token = generateAuthToken(user.id.toString());
    const origin = req.headers.origin as string | undefined;
    const isBrowser = origin && origin.includes(process.env.ORIGIN_WEBSITE || "");

    if (isBrowser) {
      res.cookie("token", token, makeCookieOptions());
      const response: AuthResponse = {
        message: "Logged in successfully",
        data: { username: user.username }
      };
      return res.status(200).json(response);
    }

    const response: AuthResponse = {
      message: "Logged in successfully",
      token,
      data: { username: user.username }
    };
    return res.status(200).json(response);
  } catch (err) {
    console.error("Error during user login:", err);
    const response: ApiResponse<null> = { message: "Internal Server Error" };
    return res.status(500).json(response);
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const response: ApiResponse<null> = { message: "User not found" };
      return res.status(404).json(response);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    await ResetToken.create({ token: resetToken, userId: user._id });

    const resetURL = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      text: `You requested a password reset. Click this link: ${resetURL}`
    });

    const response: ApiResponse<null> = { message: "Password reset email sent" };
    return res.status(200).json(response);
  } catch (err) {
    console.error("Error sending password reset email:", err);
    const response: ApiResponse<null> = { message: "Error sending password reset email" };
    return res.status(500).json(response);
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body: ResetPasswordDTO = req.body;
    const { password } = body;
    const { token } = req.params;

    if (!password) {
      const response: ApiResponse<null> = { message: "Password is required" };
      return res.status(400).json(response);
    }

    const { error } = validatePassword(password);
    if (error) {
      const response: ApiResponse<null> = { message: error.details[0].message };
      return res.status(400).json(response);
    }

    const resetToken = await ResetToken.findOne({ token });
    if (!resetToken) {
      const response: ApiResponse<null> = { message: "Invalid or expired token" };
      return res.status(400).json(response);
    }

    const user = await User.findById(resetToken.userId);
    if (!user) {
      const response: ApiResponse<null> = { message: "User not found" };
      return res.status(404).json(response);
    }

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      const response: ApiResponse<null> = { message: "New password must differ from current one." };
      return res.status(400).json(response);
    }

    const saltRounds = getSaltRounds();
    if (typeof saltRounds !== "number") {
      const response: ApiResponse<null> = { message: saltRounds.message || "Invalid salt rounds" };
      return res.status(saltRounds.status || 500).json(response);
    }

    const hashedPassword = await hashUserPassword(password, saltRounds);
    if (!hashedPassword) {
      const response: ApiResponse<null> = { message: "Error hashing password" };
      return res.status(500).json(response);
    }

    user.password = hashedPassword;
    await user.save();
    await resetToken.deleteOne();

    const response: ApiResponse<null> = { message: "Password reset successful" };
    return res.status(200).json(response);
  } catch (err) {
    console.error("Error resetting password:", err);
    const response: ApiResponse<null> = { message: "Error resetting password" };
    return res.status(500).json(response);
  }
};

export const logoutUser = (req: Request, res: Response): Response => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });
    const response: ApiResponse<null> = { message: "Logged out successfully" };
    return res.status(200).json(response);
  } catch (err) {
    console.error("Error during logout:", err);
    const response: ApiResponse<null> = { message: "Internal Server Error" };
    return res.status(500).json(response);
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user?._id) {
      const response: ApiResponse<null> = { message: "Unauthorized" };
      return res.status(401).json(response);
    }

    const user = await User.findById(req.user._id).select(
      "_id username email avatar bio links styles"
    );
    if (!user) {
      const response: ApiResponse<null> = { message: "User not found" };
      return res.status(404).json(response);
    }

    const response: UserResponse = {
      message: "Profile retrieved successfully",
      data: user
    };
    return res.status(200).json(response);
  } catch (err) {
    console.error("Error retrieving profile:", err);
    const response: ApiResponse<null> = { message: "Error retrieving profile" };
    return res.status(500).json(response);
  }
};

export const getUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      const response: ApiResponse<null> = { message: "User not found" };
      return res.status(404).json(response);
    }

    const response: UserResponse = {
      message: "User info sent successfully",
      data: {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        links: user.links,
        styles: user.styles
      }
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error("Error retrieving user info:", err);
    const response: ApiResponse<null> = { message: "Error retrieving user info" };
    return res.status(500).json(response);
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { username } = req.params;
    const updates: UpdateUserDTO = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      const response: ApiResponse<null> = { message: "User not found" };
      return res.status(404).json(response);
    }

    if (req.user?._id !== user.id.toString()) {
      const response: ApiResponse<null> = {
        message: "Forbidden: cannot edit other user's profile"
      };
      return res.status(403).json(response);
    }

    if (Object.keys(updates).length === 0) {
      const response: ApiResponse<null> = { message: "No valid fields to update" };
      return res.status(400).json(response);
    }

    deepMerge(user, updates);
    await user.save();

    const response: UserResponse = {
      message: "User info sent successfully",
      data: {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        links: user.links,
        styles: user.styles
      }
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error updating user:", error);
    const response: ApiResponse<null> = { message: "Error updating user" };
    return res.status(500).json(response);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      const response: ApiResponse<null> = { message: "User not found" };
      return res.status(404).json(response);
    }

    if (req.user?._id !== user.id.toString()) {
      const response: ApiResponse<null> = {
        message: "Forbidden: cannot delete other user's profile"
      };
      return res.status(403).json(response);
    }

    await User.deleteOne({ _id: user._id });

    const response: ApiResponse<null> = { message: "User deleted successfully" };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting user:", error);
    const response: ApiResponse<null> = { message: "Error deleting user" };
    return res.status(500).json(response);
  }
};
