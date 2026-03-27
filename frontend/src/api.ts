const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL ?? "http://localhost:4568"
).replace(/\/+$/, "");

export interface DemoCharacter {
  github_login: string;
  name: string | null;
  avatar_url: string;
  skills: {
    implementation: number;
    planning: number;
    speed: number;
    review: number;
    stamina: number;
    adaptability: number;
  };
  tech: {
    primary: string[];
    all: string[];
  };
  tendency: "implementation" | "planning" | "balanced";
  deck_score: number;
  generated_at: string;
}

export interface DemoAccount {
  github_login: string;
  name: string | null;
  avatar_url: string;
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}

export const getGithubAuthUrl = (withPrivate: boolean) =>
  `${BACKEND_URL}/auth/github?private=${withPrivate}`;

export const getMyAccount = (token: string) =>
  request<DemoAccount>("/auth/me", {}, token);

export const createCharacter = (token: string) =>
  request<DemoCharacter>("/characters", { method: "POST" }, token);

export const getMyCharacter = (token: string) =>
  request<DemoCharacter>("/characters/me", {}, token);

export const rescanCharacter = (token: string) =>
  request<DemoCharacter>("/characters/me/rescan", { method: "PUT" }, token);
