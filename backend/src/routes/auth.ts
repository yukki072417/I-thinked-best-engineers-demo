import { Router } from "express";
import { getMyAccount, handleCallback, redirectToGithub } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.get("/github", redirectToGithub);
authRouter.get("/github/callback", handleCallback);
authRouter.get("/me", authMiddleware, getMyAccount);
