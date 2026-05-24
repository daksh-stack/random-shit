# Clause Shield — Contract Risk Analyzer

AI-powered contract risk analysis for offer letters, internships, freelancer contracts, and rental agreements.

| Layer | Folder | Production |
|-------|--------|------------|
| Frontend | `frontend/` | https://contract-risk.vercel.app |
| Backend | `backend/` | https://random-shit.onrender.com |

## Quick start (local)

```bash
# Backend
cd backend
cp .env.example .env   # add GEMINI_API_KEY
npm install
npm start

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Production

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for Vercel + Render configuration.

## How it connects

- **Dev:** Vite proxies `/api` → `http://localhost:3000`
- **Prod:** React app calls `https://random-shit.onrender.com/api/v1/...` (configured via `VITE_API_BASE_URL` / `.env.production`)

## API

- `GET /api/v1/health` — health check
- `POST /api/v1/analyze` — multipart: `file`, `contractType`, `generateReport`
