import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import {
  createCharacter,
  getGithubAuthUrl,
  getMyCharacter,
  rescanCharacter,
  type DemoCharacter,
} from "./api";
import CharacterStatusCard from "./components/CharacterStatusCard/CharacterStatusCard";

const TOKEN_KEY = "demo_github_access_token";
const CHARACTER_KEY = "demo_generated_character";

type ScreenState = "idle" | "loading" | "ready" | "error";

function AuthCallback({
  onToken,
  onError,
}: {
  onToken: (token: string) => void;
  onError: (message: string) => void;
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    setSearchParams({}, { replace: true });

    if (error) {
      onError(error);
      navigate("/", { replace: true });
      return;
    }

    if (token) {
      onToken(token);
      navigate("/", { replace: true });
    }
  }, [navigate, onError, onToken, searchParams, setSearchParams]);

  return (
    <div className="demo-shell">
      <div className="demo-panel">
        <p className="eyebrow">GitHub Authentication</p>
        <h1>認証を処理しています</h1>
      </div>
    </div>
  );
}

function CharacterView({
  character,
  onRescan,
  onReset,
}: {
  character: DemoCharacter;
  onRescan: () => void;
  onReset: () => void;
}) {
  const generatedAt = useMemo(
    () =>
      new Date(character.generated_at).toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [character.generated_at],
  );

  return (
    <div className="demo-shell">
      <section className="demo-panel result-panel">
        <div className="result-panel__header">
          <div>
            <p className="eyebrow">Character Generated</p>
            <h1>キャラクター生成完了</h1>
          </div>
        </div>

        <div className="result-panel__card-wrap">
          <CharacterStatusCard character={character} />
        </div>

        <div className="actions">
          <button className="primary-button" onClick={onRescan}>
            GitHub を再スキャン
          </button>
          <button className="secondary-button" onClick={onReset}>
            認証をやり直す
          </button>
          <span className="muted">生成日時: {generatedAt}</span>
        </div>
      </section>
    </div>
  );
}

function Home({
  token,
  character,
  errorMessage,
  screenState,
  setCharacter,
  setErrorMessage,
  setScreenState,
  clearSession,
}: {
  token: string | null;
  character: DemoCharacter | null;
  errorMessage: string;
  screenState: ScreenState;
  setCharacter: (character: DemoCharacter | null) => void;
  setErrorMessage: (message: string) => void;
  setScreenState: (status: ScreenState) => void;
  clearSession: () => void;
}) {
  const [withPrivate, setWithPrivate] = useState(false);

  useEffect(() => {
    if (!token || character) {
      return;
    }

    let cancelled = false;
    setScreenState("loading");

    getMyCharacter(token)
      .then((data) => {
        if (cancelled) {
          return;
        }

        sessionStorage.setItem(CHARACTER_KEY, JSON.stringify(data));
        setCharacter(data);
        setScreenState("ready");
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setScreenState("idle");
      });

    return () => {
      cancelled = true;
    };
  }, [character, setCharacter, setScreenState, token]);

  const handleCreate = async () => {
    if (!token) {
      window.location.href = getGithubAuthUrl(withPrivate);
      return;
    }

    try {
      setErrorMessage("");
      setScreenState("loading");
      const data = await createCharacter(token);
      sessionStorage.setItem(CHARACTER_KEY, JSON.stringify(data));
      setCharacter(data);
      setScreenState("ready");
    } catch (error) {
      setScreenState("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "キャラクター生成に失敗しました",
      );
    }
  };

  const handleRescan = async () => {
    if (!token) {
      return;
    }

    try {
      setErrorMessage("");
      setScreenState("loading");
      const data = await rescanCharacter(token);
      sessionStorage.setItem(CHARACTER_KEY, JSON.stringify(data));
      setCharacter(data);
      setScreenState("ready");
    } catch (error) {
      setScreenState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "再スキャンに失敗しました",
      );
    }
  };

  const handleReset = () => {
    clearSession();
    setCharacter(null);
    setErrorMessage("");
    setScreenState("idle");
  };

  if (character) {
    return (
      <CharacterView
        character={character}
        onRescan={handleRescan}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="demo-shell">
      <section className="demo-panel">
        <p className="eyebrow">Engineer Game Demo</p>
        <h1>GitHub からキャラクターを生成</h1>
        <p className="lead">
          このデモ版は、GitHub OAuth
          で認証して、その場でキャラクターステータスを生成します。
          データベースは使わず、毎回 GitHub API からスコアを算出します。
        </p>

        <div className="info-box">
          <div>生成対象</div>
          <ul>
            <li>実装力</li>
            <li>企画力</li>
            <li>開発速度</li>
            <li>レビュー力</li>
            <li>継続力</li>
            <li>適応力</li>
          </ul>
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={withPrivate}
            onChange={(event) => setWithPrivate(event.target.checked)}
          />
          <span>プライベートリポジトリも含めて解析する</span>
        </label>

        {token && (
          <p className="muted">
            GitHub 認証済みです。キャラクターを生成する準備ができています。
          </p>
        )}

        {screenState === "loading" && (
          <p className="status-text">GitHub データを解析中...</p>
        )}
        {screenState === "error" && (
          <p className="error-text">{errorMessage}</p>
        )}

        <div className="actions">
          <button className="primary-button" onClick={handleCreate}>
            {token ? "キャラクターを生成する" : "GitHub で認証する"}
          </button>
          {token && (
            <button className="secondary-button" onClick={handleReset}>
              セッションをリセット
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [token, setTokenState] = useState<string | null>(() =>
    sessionStorage.getItem(TOKEN_KEY),
  );
  const [character, setCharacter] = useState<DemoCharacter | null>(() => {
    const raw = sessionStorage.getItem(CHARACTER_KEY);
    return raw ? (JSON.parse(raw) as DemoCharacter) : null;
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [screenState, setScreenState] = useState<ScreenState>(
    character ? "ready" : "idle",
  );

  const setToken = (value: string) => {
    if (!value) {
      sessionStorage.removeItem(TOKEN_KEY);
      setTokenState(null);
      return;
    }

    sessionStorage.setItem(TOKEN_KEY, value);
    setTokenState(value);
  };

  const clearSession = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(CHARACTER_KEY);
    setTokenState(null);
  };

  const handleAuthError = (message: string) => {
    sessionStorage.removeItem(CHARACTER_KEY);
    setCharacter(null);
    setErrorMessage(message);
    setScreenState("error");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            token={token}
            character={character}
            errorMessage={errorMessage}
            screenState={screenState}
            setCharacter={setCharacter}
            setErrorMessage={setErrorMessage}
            setScreenState={setScreenState}
            clearSession={clearSession}
          />
        }
      />
      <Route
        path="/auth/callback"
        element={<AuthCallback onToken={setToken} onError={handleAuthError} />}
      />
    </Routes>
  );
}
