import { Router } from "express";
import {
  createCharacter,
  getMyCharacter,
  rescanCharacter,
} from "../controllers/characterController.js";
import { authMiddleware } from "../middleware/auth.js";

export const charactersRouter = Router();

charactersRouter.post("/", authMiddleware, createCharacter);
charactersRouter.get("/me", authMiddleware, getMyCharacter);
charactersRouter.put("/me/rescan", authMiddleware, rescanCharacter);
