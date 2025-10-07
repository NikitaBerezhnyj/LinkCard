import dotenv from "dotenv";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { transporter } from "../config/mailConfig";
import { ResetToken } from "../models/resetTokenModel";
import { Request, Response } from "express";
import { User } from "../models/userModel";
import {
  validateRegistration,
  validateLogin,
  validatePassword
} from "../validators/userValidation";
import { generateAuthToken } from "../utils/jwtHelper";

dotenv.config();

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error } = validateRegistration(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const userEmail = await User.findOne({ email: req.body.email });
    if (userEmail) {
      return res.status(409).send({ message: "User with given email already exists!" });
    }

    const userUsername = await User.findOne({ username: req.body.username });
    if (userUsername) {
      return res.status(409).send({ message: "User with given username already exists!" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hashPassword,
      links: [{ title: "Email", url: req.body.email }]
    });

    await newUser.save();

    const token = generateAuthToken(newUser.id.toString(), newUser.username);

    return res.status(201).send({
      token: token,
      message: "User created successfully"
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    const token = generateAuthToken(user.id.toString(), user.username);
    return res.status(200).send({
      token: token,
      message: "Logged in successfully"
    });
  } catch (err) {
    console.error("Error during user login:", err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    await ResetToken.create({ token: resetToken, userId: user._id });

    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      text: `You requested a password reset. Please click the following link to reset your password: ${resetURL}`
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({ message: "Error sending password reset email" });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { password } = req.body;
  const { token } = req.params;

  if (!password) {
    res.status(400).json({ message: "Password is required" });
    return;
  }

  const { error } = validatePassword(password);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  try {
    const resetToken = await ResetToken.findOne({ token });
    if (!resetToken) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    const user = await User.findById(resetToken.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      res.status(400).json({
        message: "New password must be different from the current one."
      });
      return;
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    await resetToken.deleteOne();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userInfo = {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      links: user.links,
      styles: user.styles
    };

    res.status(200).json({ data: userInfo, message: "User info sent successfully" });
  } catch (error) {
    console.error("Error retrieving user info:", error);
    res.status(500).json({ message: "Error retrieving user info" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  const updatedData = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.username = updatedData.username || user.username;
    user.email = updatedData.email || user.email;
    user.avatar = updatedData.avatar || user.avatar;
    user.bio = updatedData.bio || user.bio;
    user.links = updatedData.links || user.links;
    user.styles = updatedData.styles || user.styles;

    await user.save();

    res.status(200).json({ message: "User updated successfully", data: user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;

  try {
    const result = await User.deleteOne({ username: username });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};
