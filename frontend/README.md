# Clause Shield — Frontend

Minimal dark-mode SPA for AI-powered contract risk analysis. Single page, no auth.

## Tech Stack

- React 18 + Vite 5
- Tailwind CSS 3
- Framer Motion 11
- Lucide React

## Installation

```bash
cd frontend
npm install
cp .env.example .env
```

## Development

**Terminal 1 — Backend** (from project `backend/` folder):

```bash
npm start
# runs on http://localhost:3000
```

Ensure backend `CORS_ORIGIN` includes `http://localhost:5173` or `*`.

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
# opens http://localhost:5173
```

Vite proxies `/api` → `http://localhost:3000` in development.

## Production Build

```bash
npm run build
npm run preview
```

**Production:** https://contract-risk.vercel.app → API https://random-shit.onrender.com  

Configured in `.env.production` and `src/config/env.js`. See root [DEPLOYMENT.md](../DEPLOYMENT.md).

## API Integration

| Action | Endpoint | Body |
|--------|----------|------|
| Analyze | `POST /api/v1/analyze` | `multipart/form-data`: `file`, `contractType`, `generateReport=false` |
| PDF report | `POST /api/v1/analyze` | Same with `generateReport=true` → PDF blob |

### Example (curl via proxy)

```bash
curl -X POST http://localhost:5173/api/v1/analyze \
  -F "file=@contract.pdf" \
  -F "contractType=offer_letter" \
  -F "generateReport=false"
```

## User Flow

1. Open app → upload UI immediately visible  
2. Select document type + file (drag/drop or browse)  
3. Click **Analyze contract** → processing animation  
4. Results dashboard: score, summary, risk cards, HR questions, actions  
5. **Copy results** / **Download report** / **Analyze another**

## Project Structure

```
src/
├── App.jsx                 # Phase orchestration
├── hooks/                  # useAnalysis, useClipboard
├── services/               # API client
├── components/             # UI + results + upload
├── sections/               # Hero upload section
├── utils/                  # formatters, copy builder
└── constants/
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend URL (empty = use Vite proxy) |
| `VITE_API_TIMEOUT_MS` | Request timeout (default 120000) |
| `VITE_MAX_FILE_SIZE_MB` | Client-side file limit (default 10) |

## Postman / Manual Test

1. Start backend + frontend  
2. Open `http://localhost:5173`  
3. Upload a PDF offer letter, type `offer_letter`  
4. Verify JSON results render  
5. Click **Download report** (re-sends file with `generateReport=true`)
