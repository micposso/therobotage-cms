# Railway Deployment

This project deploys the `frontend/` Next.js app to Railway.

## Setup

### 1. Connect your repo
- Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
- Select this repository

### 2. railway.toml
A `railway.toml` file at the repo root handles the build and start commands automatically:

```toml
[build]
builder = "nixpacks"
buildCommand = "cd frontend && npm install && npm run build"

[deploy]
startCommand = "cd frontend && npm run start"
```

No additional configuration is needed.

### 3. Generate a public domain
- In your Railway service → **Settings → Networking → Generate Domain**

## Redeploy
Push to your connected branch (e.g. `main`) to trigger a new deployment automatically.
