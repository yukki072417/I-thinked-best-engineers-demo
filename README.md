# Demo App

`demo` は、GitHub 認証を行ってその場でキャラクターを生成するだけのデモ版です。

- バックエンドは `demo/backend`
- フロントエンドは `demo/frontend`
- データベースは使いません
- GitHub API から毎回スコアを算出します
- Vercel では `2 Project` 構成でそのまま公開できます

## 1. バックエンドの準備

```bash
cd demo/backend
copy .env.example .env
npm install
npm run dev
```

`.env` には GitHub OAuth App の `GITHUB_CLIENT_ID` と `GITHUB_CLIENT_SECRET` を設定してください。

推奨設定:

- Homepage URL: `http://localhost:5174`
- Authorization callback URL: `http://localhost:4568/auth/github/callback`

## 2. フロントエンドの準備

```bash
cd demo/frontend
copy .env.example .env
npm install
npm run dev
```

フロントエンドは `http://localhost:5174`、バックエンドは `http://localhost:4568` を想定しています。

## 3. 使い方

1. `http://localhost:5174` を開く
2. GitHub で認証する
3. キャラクターを生成する

## API

- `GET /auth/github`
- `GET /auth/github/callback`
- `GET /auth/me`
- `POST /characters`
- `GET /characters/me`
- `PUT /characters/me/rescan`

## Vercel デプロイ

2026-03-27 時点では、まず `frontend` と `backend` を別 Project として載せるのが安定です。

### Backend Project

Project Root を `demo/backend` に設定します。

Environment Variables:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `FRONTEND_ORIGIN`
- `BACKEND_ORIGIN`
- `PORT`

推奨値:

- `FRONTEND_ORIGIN=https://<your-frontend>.vercel.app`
- `BACKEND_ORIGIN=https://<your-backend>.vercel.app`
- `PORT=3000`

このバックエンドは [`vercel.json`](./backend/vercel.json) で全リクエストを `api/index.ts` に流すようにしてあります。

GitHub OAuth App の callback URL は次の形にしてください。

```text
https://<your-backend>.vercel.app/auth/github/callback
```

### Frontend Project

Project Root を `demo/frontend` に設定します。

Environment Variables:

- `VITE_BACKEND_URL=https://<your-backend>.vercel.app`

このフロントエンドは [`vercel.json`](C:\Users\yukin\.Projects\EngineerGame\demo\frontend\vercel.json) で SPA deep link に対応しています。

### デプロイ順

1. backend を先にデプロイ
2. backend の本番 URL を控える
3. frontend に `VITE_BACKEND_URL` として設定してデプロイ
4. frontend の本番 URL を backend の `FRONTEND_ORIGIN` に設定して再デプロイ
5. GitHub OAuth App の Homepage URL / Callback URL を本番URLへ更新
