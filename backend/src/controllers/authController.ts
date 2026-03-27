import crypto from "crypto";
import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { fetchGithubProfile } from "../services/githubService.js";

const stateStore = new Set<string>();

const clientId = () => process.env.GITHUB_CLIENT_ID ?? "";
const clientSecret = () => process.env.GITHUB_CLIENT_SECRET ?? "";
const frontendOrigin = () => process.env.FRONTEND_ORIGIN ?? "http://localhost:5174";
const backendOrigin = () => process.env.BACKEND_ORIGIN ?? "";

function callbackUrl(req: Request): string {
  const origin =
    backendOrigin() || `${req.protocol}://${req.get("host") ?? "localhost:4568"}`;
  return `${origin.replace(/\/+$/, "")}/auth/github/callback`;
}

export function redirectToGithub(req: Request, res: Response): void {
  const withPrivate = req.query.private === "true";
  const scope = withPrivate ? "read:user repo" : "read:user public_repo";
  const state = crypto.randomBytes(16).toString("hex");

  stateStore.add(state);

  const params = new URLSearchParams({
    client_id: clientId(),
    redirect_uri: callbackUrl(req),
    scope,
    state,
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}

export async function handleCallback(req: Request, res: Response): Promise<void> {
  const { code, state, error } = req.query as Record<string, string | undefined>;

  if (error || !code) {
    res.redirect(`${frontendOrigin()}/auth/callback?error=${error ?? "missing_code"}`);
    return;
  }

  if (!state || !stateStore.has(state)) {
    res.redirect(`${frontendOrigin()}/auth/callback?error=invalid_state`);
    return;
  }

  stateStore.delete(state);

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId(),
      client_secret: clientSecret(),
      code,
    }),
  });

  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
  };

  if (!tokenData.access_token) {
    res.redirect(
      `${frontendOrigin()}/auth/callback?error=${tokenData.error ?? "token_exchange_failed"}`,
    );
    return;
  }

  res.redirect(`${frontendOrigin()}/auth/callback?token=${tokenData.access_token}`);
}

export async function getMyAccount(req: Request, res: Response): Promise<void> {
  const { githubToken } = req as AuthRequest;

  try {
    const profile = await fetchGithubProfile(githubToken);
    res.json({
      github_login: profile.login,
      name: profile.name,
      avatar_url: profile.avatar_url,
    });
  } catch {
    res.status(500).json({
      error: "account_fetch_failed",
      message: "GitHub アカウント情報の取得に失敗しました",
    });
  }
}
