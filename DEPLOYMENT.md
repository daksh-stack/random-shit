# Deployment — Connected Production Setup

| Service | URL |
|---------|-----|
| **Frontend** (Vercel) | https://contract-risk.vercel.app |
| **Backend** (Render) | https://random-shit.onrender.com |

The frontend calls the Render API directly in production (`VITE_API_BASE_URL`).

---

## 1. Render (backend)

In [Render Dashboard](https://dashboard.render.com) → your service → **Environment**:

| Variable | Value |
|----------|--------|
| `GEMINI_API_KEY` | Your Google AI Studio key |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `https://contract-risk.vercel.app,http://localhost:5173` |
| `GEMINI_MODEL` | `gemini-1.5-flash` (or your preferred model) |

Then **Manual Deploy** → Deploy latest commit.

Health check: https://random-shit.onrender.com/api/v1/health

---

## 2. Vercel (frontend)

In [Vercel Dashboard](https://vercel.com) → project → **Settings** → **Environment Variables**:

| Variable | Value | Environments |
|----------|--------|--------------|
| `VITE_API_BASE_URL` | `https://random-shit.onrender.com` | Production |
| `VITE_API_TIMEOUT_MS` | `120000` | Production |

> `.env.production` in the repo already sets these for Production builds. Env vars in Vercel override if set.

**Root directory:** `frontend`  
**Build command:** `npm run build`  
**Output directory:** `dist`

Redeploy after env changes.

---

## 3. Verify end-to-end

1. Open https://contract-risk.vercel.app  
2. Upload a PDF, choose document type, click **Analyze contract**  
3. Results should load (first request may be slow if Render was sleeping)

**Browser DevTools → Network:** requests should go to  
`https://random-shit.onrender.com/api/v1/analyze`  
(not `contract-risk.vercel.app/api/...`).

---

## 4. Local development (unchanged)

```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm run dev
```

Leave `frontend/.env` with empty `VITE_API_BASE_URL` — Vite proxies `/api` to `localhost:3000`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error in browser | Set `CORS_ORIGIN` on Render to include `https://contract-risk.vercel.app` |
| Network error / timeout | Render free tier cold start — wait 30–60s and retry |
| 503 AI_UNAVAILABLE | Check `GEMINI_API_KEY` on Render |
| API hits wrong host | Redeploy Vercel after setting `VITE_API_BASE_URL` |
