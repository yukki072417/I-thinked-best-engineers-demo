import type { NextFunction, Request, Response } from "express";
import { fetchGithubProfile } from "../services/githubService.js";

export interface AuthRequest extends Request {
  githubToken: string;
  githubLogin: string;
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({
      error: "unauthorized",
      message: "Bearer token required",
    });
    return;
  }

  const token = header.slice(7);

  try {
    const profile = await fetchGithubProfile(token);
    (req as AuthRequest).githubToken = token;
    (req as AuthRequest).githubLogin = profile.login;
    next();
  } catch {
    res.status(401).json({
      error: "unauthorized",
      message: "Invalid GitHub token",
    });
  }
}
