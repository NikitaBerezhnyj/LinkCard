import { Router, Request, Response } from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  getUser,
  updateUser,
  deleteUser
} from "../controllers/userController";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  console.log("Register route hit");
  try {
    await registerUser(req, res);
  } catch (error) {
    console.error("Error in /register route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", (req: Request, res: Response) => {
  loginUser(req, res).catch(error => {
    console.error("Error in /login route:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  });
});

router.post("/password/forgot", (req: Request, res: Response) => {
  forgotPassword(req, res).catch(error => {
    console.error("Error in /password/forgot route:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  });
});

router.post("/password/reset/:token", (req: Request, res: Response) => {
  resetPassword(req, res).catch(error => {
    console.error("Error in /password/reset/:token route:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  });
});

router.post("/logout", logoutUser);

router.get("/user/:username", (req: Request, res: Response) => {
  getUser(req, res).catch(error => {
    console.error("Error in /user/:token route:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  });
});

router.patch("/user/:username", authMiddleware, (req, res) => {
  updateUser(req as AuthRequest, res).catch(error => {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  });
});

router.delete("/user/:username", authMiddleware, (req, res) => {
  deleteUser(req as AuthRequest, res).catch(error => {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  });
});

export default router;
