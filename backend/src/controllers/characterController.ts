import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { buildCharacterFromGithub } from "../services/githubService.js";

export async function createCharacter(req: Request, res: Response): Promise<void> {
  const { githubToken } = req as AuthRequest;

  try {
    const character = await buildCharacterFromGithub(githubToken);
    res.status(201).json(character);
  } catch (error) {
    console.error("[demo] character generation failed:", error);
    res.status(500).json({
      error: "character_generation_failed",
      message: "キャラクター生成に失敗しました",
    });
  }
}

export async function getMyCharacter(req: Request, res: Response): Promise<void> {
  const { githubToken } = req as AuthRequest;

  try {
    const character = await buildCharacterFromGithub(githubToken);
    res.json(character);
  } catch (error) {
    console.error("[demo] character fetch failed:", error);
    res.status(500).json({
      error: "character_fetch_failed",
      message: "キャラクター情報の取得に失敗しました",
    });
  }
}

export async function rescanCharacter(req: Request, res: Response): Promise<void> {
  const { githubToken } = req as AuthRequest;

  try {
    const character = await buildCharacterFromGithub(githubToken);
    res.json(character);
  } catch (error) {
    console.error("[demo] character rescan failed:", error);
    res.status(500).json({
      error: "character_rescan_failed",
      message: "キャラクター再生成に失敗しました",
    });
  }
}
