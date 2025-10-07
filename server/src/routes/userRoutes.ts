import { Router, Request, Response } from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUser,
  updateUser,
  deleteUser
} from "../controllers/userController";

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

router.get("/user/:username", (req: Request, res: Response) => {
  getUser(req, res).catch(error => {
    console.error("Error in /password/reset/:token route:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  });
});

router.put("/user/:username", (req: Request, res: Response) => {
  updateUser(req, res).catch(error => {
    console.error("Error in /password/reset/:token route:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  });
});

router.delete("/user/:username", (req: Request, res: Response) => {
  deleteUser(req, res).catch(error => {
    console.error("Error in /password/reset/:token route:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  });
});

export default router;
