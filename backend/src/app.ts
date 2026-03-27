import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth.js";
import { charactersRouter } from "./routes/characters.js";

export function createApp() {
  const app = express();
  const frontendOrigin = (
    process.env.FRONTEND_ORIGIN ?? "http://localhost:5174"
  ).replace(/\/+$/, "");

  app.use(cors({ origin: frontendOrigin }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({
      ok: true,
      service: "engineer-game-demo-backend",
    });
  });

  app.use("/auth", authRouter);
  app.use("/characters", charactersRouter);

  return app;
}

export const app = createApp();
