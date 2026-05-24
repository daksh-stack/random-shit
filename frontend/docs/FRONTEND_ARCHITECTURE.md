# Contract Risk Analyzer — Frontend Architecture (Part 1)

**Product:** AI contract risk analysis for students, freelancers, and renters  
**Philosophy:** Fast, minimal, dark-only, calming, instantly understandable  
**Stack:** React · Vite · Tailwind CSS · Framer Motion · Lucide React  
**Scope:** Single-page app — no auth, no multi-page marketing site

---

## 1. Complete Frontend Architecture

### Pattern: Single-View State Machine SPA

The entire product lives on **one route** (`/`). UI state drives which “section” is visible — not React Router pages.

```
┌─────────────────────────────────────────────────────────────┐
│                     App (dark shell)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              AppShell (max-width container)            │  │
│  │   ┌─────────────────────────────────────────────────┐  │  │
│  │   │  HeroUploadSection    (idle)                  │  │  │
│  │   │  ProcessingSection    (uploading/analyzing)   │  │  │
│  │   │  ResultsDashboard     (success)               │  │  │
│  │   │  ErrorBanner          (failure, inline)         │  │  │
│  │   └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │                              ▲
         │  analyzeContract()           │  JSON / PDF blob
         ▼                              │
    ┌─────────┐                    ┌──────────┐
    │ API     │ ─── POST multipart │ Backend  │
    │ Client  │                    │ :3000    │
    └─────────┘                    └──────────┘
```

### Layer responsibilities

| Layer | Responsibility |
|-------|----------------|
| **App / state** | Global UI phase, analysis result, errors, selected contract type |
| **Sections** | Large composable regions (hero, processing, results) |
| **Components** | Reusable UI primitives (buttons, cards, badges, upload zone) |
| **Hooks** | `useAnalysis`, `useClipboard`, `useDownloadReport` |
| **Services** | HTTP client, response normalizers, copy/export formatters |
| **Design tokens** | Colors, type scale, spacing via Tailwind `@theme` / CSS variables |

### UI phases (finite state)

| Phase | User sees | Trigger |
|-------|-----------|---------|
| `idle` | Hero + upload | Initial load / “Analyze another” |
| `validating` | Inline field hints | File selected, before submit |
| `uploading` | Processing UI (early) | Form submit |
| `analyzing` | Processing UI (steps) | Request in flight |
| `success` | Results dashboard | 200 + `success: true` |
| `error` | Error banner + return to upload | 4xx/5xx/network |

No separate landing, pricing, or login states.

---

## 2. Folder Structure

```
frontenf/
├── public/
│   └── favicon.svg
├── docs/
│   └── FRONTEND_ARCHITECTURE.md
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .gitignore
└── src/
    ├── main.jsx
    ├── App.jsx
    │
    ├── styles/
    │   ├── index.css          # Tailwind directives + CSS variables
    │   └── tokens.css         # Optional raw token reference
    │
    ├── config/
    │   └── env.js             # VITE_API_BASE_URL
    │
    ├── constants/
    │   ├── contractTypes.js   # Labels + backend enum values
    │   └── analysisSteps.js   # Processing step copy
    │
    ├── services/
    │   ├── apiClient.js       # fetch wrapper, timeout, errors
    │   └── analysisApi.js     # analyzeContract(), downloadReport()
    │
    ├── hooks/
    │   ├── useAnalysis.js
    │   ├── useClipboard.js
    │   └── useReducedMotion.js
    │
    ├── utils/
    │   ├── formatters.js      # severity labels, risk score display
    │   ├── copyBuilder.js     # Plain-text export for clipboard
    │   └── riskColors.js      # severity → token class mapping
    │
    ├── components/
    │   ├── layout/
    │   │   ├── AppShell.jsx
    │   │   └── Section.jsx
    │   │
    │   ├── ui/                # Design system primitives
    │   │   ├── Button.jsx
    │   │   ├── Badge.jsx
    │   │   ├── Card.jsx
    │   │   ├── Divider.jsx
    │   │   ├── IconButton.jsx
    │   │   ├── ProgressBar.jsx
    │   │   ├── Skeleton.jsx
    │   │   ├── Select.jsx
    │   │   └── Tooltip.jsx
    │   │
    │   ├── upload/
    │   │   ├── UploadZone.jsx
    │   │   ├── ContractTypeSelect.jsx
    │   │   └── AnalyzeButton.jsx
    │   │
    │   ├── processing/
    │   │   ├── ProcessingSection.jsx
    │   │   ├── StepIndicator.jsx
    │   │   └── ShimmerLoader.jsx
    │   │
    │   ├── results/
    │   │   ├── ResultsDashboard.jsx
    │   │   ├── RiskScoreHero.jsx
    │   │   ├── SummaryBlock.jsx
    │   │   ├── RiskCard.jsx
    │   │   ├── RiskCardList.jsx
    │   │   ├── QuestionsPanel.jsx
    │   │   ├── ClausesPanel.jsx
    │   │   ├── ActionsPanel.jsx
    │   │   ├── ResultsToolbar.jsx
    │   │   └── EmptyRisksState.jsx
    │   │
    │   └── feedback/
    │       ├── ErrorBanner.jsx
    │       └── DisclaimerFooter.jsx
    │
    └── sections/              # Page-level composition
        ├── HeroUploadSection.jsx
        └── (Processing/Results composed in App.jsx or sections/)
```

**Intentionally absent:** `pages/`, `router/`, `store/` (Redux), `auth/`, `blog/`.

---

## 3. Component Hierarchy

```
App
└── AppShell
    ├── DisclaimerFooter (always subtle, bottom)
    │
    ├── [phase !== success] HeroUploadSection
    │   ├── product title + subtitle
    │   ├── ContractTypeSelect
    │   ├── UploadZone (drag/drop + file picker)
    │   ├── AnalyzeButton
    │   └── ErrorBanner (if error)
    │
    ├── [phase === uploading | analyzing] ProcessingSection
    │   ├── StepIndicator
    │   ├── ShimmerLoader / ProgressBar
    │   └── status copy (calm, short)
    │
    └── [phase === success] ResultsDashboard
        ├── ResultsToolbar
        │   ├── Button "Analyze another"
        │   ├── Button "Copy results"
        │   └── Button "Download report"
        ├── RiskScoreHero
        ├── SummaryBlock
        ├── RiskCardList
        │   └── RiskCard × N (expandable)
        ├── QuestionsPanel (aggregated from all risks)
        ├── ClausesPanel (collapsible excerpts)
        ├── ActionsPanel (suggested next steps)
        └── meta disclaimer + requestId (subtle)
```

### RiskCard (progressive disclosure)

```
RiskCard (collapsed default)
├── header: type label + severity Badge + chevron
└── [expanded]
    ├── simplifiedMeaning (prominent)
    ├── explanation
    ├── clause excerpt (muted, monospace-ish)
    └── questionsToAsk (bullet list)
```

---

## 4. UI Design System

### Principles

1. **Content first** — typography carries hierarchy; decoration is secondary  
2. **One accent** — cool neutral accent for focus/actions; semantic colors only for risk  
3. **Surfaces, not boxes** — 1px borders + slight background steps, not heavy cards  
4. **Breathing room** — default section padding `py-16`–`py-24`, card padding `p-6`–`p-8`  
5. **Calm motion** — 200–350ms easings; respect `prefers-reduced-motion`

### Primitives

| Token component | Usage |
|-----------------|--------|
| `Button` | Primary analyze, secondary copy/download |
| `Card` | Results modules; border `border-white/8`, bg `bg-surface-1` |
| `Badge` | Severity chips (subtle tint, not neon) |
| `UploadZone` | Dashed border, hover/focus ring |
| `Skeleton` | Processing shimmer |
| `Section` | Consistent vertical rhythm wrapper |

---

## 5. Color Palette

Dark-only. No light theme.

| Token | Hex (approx) | Usage |
|-------|----------------|--------|
| `bg-base` | `#0B0D10` | Page background |
| `bg-elevated` | `#12151A` | Sections / panels |
| `surface-1` | `#181C22` | Cards |
| `surface-2` | `#1F2430` | Hover / expanded card |
| `border-subtle` | `rgba(255,255,255,0.08)` | Dividers, card edges |
| `text-primary` | `#EDEFF3` | Headings, body |
| `text-secondary` | `#9AA3B2` | Supporting copy |
| `text-muted` | `#6B7280` | Labels, meta |
| `accent` | `#7C9CFF` | Focus ring, primary button, links |
| `accent-hover` | `#98B1FF` | Button hover |
| `risk-low` | `#4ADE80` at 70% opacity bg | Success-safe tone |
| `risk-medium` | `#FBBF24` | Caution |
| `risk-high` | `#F87171` | Danger (subtle, not alarm red fill) |
| `risk-critical` | `#EF4444` | Strongest signal |

**Rules:** No rainbow gradients. Risk colors appear as **left border**, **badge tint**, or **small dot** — never full red backgrounds.

---

## 6. Typography System

**Font stack (system-friendly, fast):**

```css
font-family: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
```

Optional: single variable font later; MVP uses Inter from Google Fonts or self-hosted.

| Role | Size (desktop) | Weight | Tracking | Usage |
|------|----------------|--------|----------|--------|
| Display | 40–48px | 600 | -0.02em | Product title |
| H1 | 28–32px | 600 | -0.01em | Results: Risk score |
| H2 | 20–24px | 600 | normal | Section titles |
| H3 | 16–18px | 500 | normal | Card titles |
| Body | 15–16px | 400 | normal | Explanations |
| Small | 13–14px | 400 | normal | Meta, disclaimer |
| Mono excerpt | 13px | 400 | normal | Clause text (`font-mono` or `ui-monospace`) |

**Line height:** 1.5–1.65 body, 1.2 headings  
**Max line width:** `max-w-prose` (~65ch) for long explanations

---

## 7. Spacing System

Tailwind default scale, used consistently:

| Token | Value | Usage |
|-------|-------|--------|
| `section-y` | `py-20 md:py-28` | Between major sections |
| `stack-sm` | `space-y-3` | Inside compact groups |
| `stack-md` | `space-y-6` | Card internal |
| `stack-lg` | `space-y-10` | Dashboard sections |
| `container` | `max-w-3xl mx-auto px-4 md:px-6` | Main column (narrow for readability) |
| `card-pad` | `p-6 md:p-8` | Risk cards |

**Layout width:** Main column `max-w-3xl` (results readable); upload zone can match same width for alignment.

---

## 8. Motion System

**Library:** Framer Motion — micro-interactions only.

| Interaction | Motion | Duration |
|-------------|--------|----------|
| Phase: idle → processing | Fade + slight `y: 8 → 0` on ProcessingSection | 300ms |
| Phase: processing → results | Fade out upload; fade in dashboard `opacity 0→1` | 350ms |
| RiskCard expand | `height: auto` animate via `AnimatePresence` | 250ms |
| Upload zone drag-over | Border color transition (CSS), scale `1.01` max | 150ms |
| Shimmer loader | CSS keyframe shimmer on skeleton | loop, subtle |
| Button press | `scale: 0.98` | 100ms |

**Avoid:** parallax, bouncing loaders, staggered card cascades, page slides.

**Reduced motion:** `useReducedMotion` → disable transforms; instant opacity only.

---

## 9. State Management Strategy

### MVP: React `useState` + `useReducer` in `App.jsx` + custom hook

No Redux/Zustand required for single-page flow.

```javascript
// Conceptual state shape
{
  phase: 'idle' | 'validating' | 'uploading' | 'analyzing' | 'success' | 'error',
  contractType: 'offer_letter',
  file: File | null,
  result: AnalysisResult | null,
  error: { code, message } | null,
  expandedRiskId: string | null,
  isCopying: boolean,
  isDownloading: boolean,
}
```

**`useAnalysis` hook** encapsulates:

- `submitAnalysis(file, contractType)`  
- Phase transitions  
- AbortController for cancel on unmount  
- Normalized `AnalysisResult` from API  

**Derived state (no storage):**

- `allQuestions` — flatMap `risks[].questionsToAsk`  
- `allClauses` — map `risks[].clause` with type labels  
- `suggestedActions` — rule-based copy from severities (frontend-only MVP strings)

**Persistence:** None (no localStorage) for privacy alignment with backend ephemeral model.

**Future:** Extract reducer to `analysisStore.js`; add React Query only if caching/history is added later.

---

## 10. API Integration Architecture

### Environment

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Endpoints consumed

| Action | Method | Path | Body |
|--------|--------|------|------|
| Analyze (JSON) | POST | `/api/v1/analyze` | `multipart/form-data`: `file`, `contractType`, `generateReport=false` |
| Download report | POST | `/api/v1/analyze` | Same with `generateReport=true` → `blob` PDF |

### Client flow (`analysisApi.js`)

```
1. Build FormData(file, contractType, generateReport)
2. fetch with timeout (120s aligned with backend)
3. If JSON: parse → validate success + risks array
4. If blob: trigger browser download
5. Map API errors: { code, message } → user-friendly strings
```

### Response mapping

| API field | UI destination |
|-----------|----------------|
| `riskScore`, `riskLevel` | RiskScoreHero |
| `summary` | SummaryBlock |
| `risks[]` | RiskCardList |
| `risks[].questionsToAsk` | QuestionsPanel (aggregated) |
| `risks[].clause` | ClausesPanel |
| `meta.disclaimer` | DisclaimerFooter |
| `meta.partial` / `warnings` | Subtle banner in results |

### Contract types (must match backend)

| Value | UI label |
|-------|----------|
| `offer_letter` | Offer Letter |
| `internship` | Internship Agreement |
| `freelancer` | Freelancer Contract |
| `rental` | Rental Agreement |
| `general_contract` | General Contract |

### Error UX mapping

| Code | User message tone |
|------|-------------------|
| `FILE_TOO_LARGE` | Calm, suggest smaller file |
| `UNSUPPORTED_FILE` | List allowed types |
| `NO_TEXT_FOUND` | Suggest clearer scan/PDF |
| `RATE_LIMITED` | Wait and retry |
| `AI_UNAVAILABLE` | Partial results if `success` + `partial` |
| Network | Connection issue, retry |

### CORS

Backend `CORS_ORIGIN` must include Vite dev URL (`http://localhost:5173`) in production deploy config.

---

## 11. Responsive Strategy

**Mobile-first**, single column always.

| Breakpoint | Behavior |
|------------|----------|
| `< 640px` | Full-width upload; stacked toolbar buttons; score hero compact |
| `640–1024px` | Same layout, increased padding |
| `> 1024px` | Still `max-w-3xl` centered — readability over width |

- Touch targets ≥ 44px  
- Upload zone min-height ~160px on mobile  
- Risk cards full-width; expand tap-friendly  
- Sticky **not** used (avoids clutter)

---

## 12. UX Rationale

| Decision | Why |
|----------|-----|
| Single page | User goal is one task; no navigation friction |
| Dark only | Reduces eye strain for long clause reading; modern AI-tool norm |
| Narrow column | Legal text needs focus; wide dashboards feel “enterprise” |
| Collapsed risk cards | Progressive disclosure — scan severities first, read details on demand |
| Aggregated questions panel | Actionable output users share with HR — high product value |
| Copy results (plain text) | Viral/share workflow (“look what it found”) |
| Calm processing copy | Anxiety reduction — legal review feels stressful |
| No sidebar | Eliminates fake “dashboard” complexity |
| Analyze another | Resets state without reload — fast second document |
| Disclaimer always visible | Trust + legal boundary without modal annoyance |

**Emotional target:** “I understand what might hurt me” — not “I used a legal AI.”

---

## 13. Accessibility Strategy

| Area | Approach |
|------|----------|
| Color | Severity never conveyed by color alone — text labels + icons |
| Focus | Visible `ring-2 ring-accent` on interactive elements |
| Keyboard | Upload zone activatable via button; Enter submits; cards expandable with Enter/Space |
| Screen readers | `aria-live="polite"` on processing status; `aria-expanded` on RiskCard |
| Motion | `prefers-reduced-motion` respected |
| Contrast | Body text ≥ WCAG AA on `bg-base` |
| Errors | `role="alert"` on ErrorBanner |
| File input | Native input associated with label; file name announced |

---

## 14. Future Scalability Planning

| Future feature | Extension point |
|----------------|-----------------|
| User accounts | Add `auth/` + token in `apiClient`; wrap App with provider — **no layout rewrite** |
| Analysis history | React Query + `/history` route as second page only when needed |
| Personalization (student vs freelancer) | Pre-upload persona toggles → extra FormData field |
| Community scam signals | New `CommunityInsights` panel in ResultsDashboard |
| Browser extension | Reuse `analysisApi.js` + formatters in shared package |
| i18n | Copy in `constants/copy/` per locale |
| Theming | Still dark-only by product decision; tokens in CSS variables |
| Streaming progress | Replace processing steps with SSE hook in `useAnalysis` |
| PWA offline | Vite PWA plugin — optional, not MVP |

**Package boundary for scale:** Keep `services/` and `utils/` framework-agnostic so they can move to `@clause-risk/shared` later.

---

## Results Dashboard — Section Specs

### 1. Overall Risk Score (`RiskScoreHero`)

- Large numeric score `0–100`  
- Band label: Low / Medium / High / Critical (from `riskLevel`)  
- Thin arc or horizontal bar (optional, minimal) — color from band  
- One-line interpretation: “Several clauses may limit your flexibility”

### 2. Contract Summary (`SummaryBlock`)

- `summary` from API, prose styling  
- If `meta.partial`, small warning line

### 3. Risk Cards (`RiskCardList`)

- Sorted by severity (critical → low)  
- Each card: type (humanized), severity badge, expand for details

### 4. Questions To Ask HR (`QuestionsPanel`)

- Deduplicated list from all `questionsToAsk`  
- Numbered, copy-friendly

### 5. Important Clauses (`ClausesPanel`)

- Collapsed list of excerpts with type pill  
- “Show full clause” expands inline (not modal)

### 6. Suggested Actions (`ActionsPanel`)

- MVP: static heuristic list based on detected risk types  
  - e.g. bond detected → “Clarify bond enforceability and duration in writing”  
- 3–5 bullets max

### 7. Download Report

- Calls API with `generateReport=true`  
- Saves `risk-report-{requestId}.pdf`

### 8. Copy Results

- `copyBuilder.js` → plain-text markdown-ish summary for clipboard  
- Toast: “Copied to clipboard”

---

## Vite Configuration Notes (for Part 2)

```javascript
// vite.config.js — proxy in dev
server: {
  proxy: {
    '/api': 'http://localhost:3000',
  },
},
```

Production: `VITE_API_BASE_URL` points to deployed backend.

---

## Dependencies (Part 2 — real packages only)

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "framer-motion": "^11.x",
    "lucide-react": "^0.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.x",
    "vite": "^5.x",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x"
  }
}
```

No React Router, no Next.js, no UI kit (shadcn optional later — MVP uses custom primitives for calmer control).

---

## Part 2 Preview (implementation checklist)

When implementing in `frontenf/`:

1. Scaffold Vite + React  
2. Configure Tailwind + tokens in `index.css`  
3. Build `ui/` primitives  
4. Build `HeroUploadSection` + `useAnalysis`  
5. Build `ProcessingSection` with step copy  
6. Build `ResultsDashboard` modules  
7. Wire API + error handling  
8. Copy/download actions  
9. Responsive pass + a11y pass  
10. README with `npm run dev` + env example  

---

*Architecture only — no implementation code in this document per Part 1 scope.*
