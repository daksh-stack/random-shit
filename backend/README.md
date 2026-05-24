# Clause Risk Analyzer — Backend MVP

Stateless Express API that extracts contract text, detects risky clauses with rules/regex, enriches only flagged excerpts via Gemini, returns JSON, optionally generates a PDF report, and deletes all temp files after processing.

## Tech Stack

- Node.js, Express.js
- Multer, pdf-parse, Tesseract.js, mammoth (DOCX)
- Google Gemini API, PDFKit
- helmet, cors, express-rate-limit, express-validator, dotenv

## Installation

```bash
cd clause-risk-analizer
npm install
cp .env.example .env
```

Edit `.env` and set `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/apikey).

## Startup

```bash
# Development (auto-restart on Node 18+)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:3000` (or `PORT` from `.env`).

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | API info |
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/analyze` | Upload + analyze contract |

### POST `/api/v1/analyze`

**Content-Type:** `multipart/form-data`

| Field | Required | Description |
|-------|----------|-------------|
| `file` | Yes | PDF, PNG, JPG, JPEG, or DOCX |
| `contractType` | Yes | `offer_letter`, `internship`, `freelancer`, `rental`, `general_contract` |
| `generateReport` | No | `true` returns PDF download; default `false` returns JSON |

**Supported files:** PDF, PNG, JPG, JPEG, DOCX (max 10 MB by default)

### Example — JSON response (curl)

```bash
curl -X POST http://localhost:3000/api/v1/analyze \
  -F "file=@./sample-offer-letter.pdf" \
  -F "contractType=offer_letter" \
  -F "generateReport=false"
```

### Example — PDF report download

```bash
curl -X POST http://localhost:3000/api/v1/analyze \
  -F "file=@./sample-offer-letter.pdf" \
  -F "contractType=offer_letter" \
  -F "generateReport=true" \
  --output risk-report.pdf
```

### Success JSON shape

```json
{
  "success": true,
  "requestId": "uuid",
  "summary": "Overall summary...",
  "riskScore": 72,
  "riskLevel": "high",
  "risks": [
    {
      "type": "employment_bond",
      "severity": "high",
      "clause": "excerpt...",
      "explanation": "plain language explanation",
      "simplifiedMeaning": "one line TL;DR",
      "questionsToAsk": ["Question 1?"]
    }
  ],
  "meta": {
    "contractType": "offer_letter",
    "processingMs": 4200,
    "usedOcr": false,
    "clauseCount": 3,
    "aiEnriched": true,
    "partial": false,
    "disclaimer": "This is not legal advice..."
  }
}
```

## Postman Collection (manual setup)

1. Create request: **POST** `{{baseUrl}}/api/v1/analyze`
2. Body → **form-data**:
   - `file` (File) → select contract PDF
   - `contractType` (Text) → `offer_letter`
   - `generateReport` (Text) → `false`
3. Environment variable: `baseUrl` = `http://localhost:3000`

**Health check request:**

- **GET** `{{baseUrl}}/api/v1/health`

## Project Structure

```
src/
├── app.js, server.js
├── config/
├── routes/, controllers/
├── middleware/, validators/
├── services/
├── parsers/, detectors/, ai/, prompts/
├── reports/
└── utils/
temp/          # ephemeral uploads (gitignored)
```

## Architecture Notes

- **Hybrid intelligence:** rules/regex detect clauses first; Gemini only explains provided excerpts.
- **No database, no auth, no persistent storage.**
- **Temp cleanup** runs after every request (JSON immediately; PDF after stream ends).
- **Extend detectors:** add files under `src/detectors/rules/`.

## Environment Variables

See `.env.example` for all options.

## Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| `VALIDATION_ERROR` | 400 | Invalid input |
| `UNSUPPORTED_FILE` | 415 | Wrong file type |
| `FILE_TOO_LARGE` | 413 | Exceeds size limit |
| `EXTRACTION_FAILED` | 422 | Parse/OCR failed |
| `NO_TEXT_FOUND` | 422 | Empty document |
| `AI_UNAVAILABLE` | 503 | Gemini failed (partial fallback may apply) |
| `RATE_LIMITED` | 429 | Too many requests |

## Disclaimer

This API provides informational risk highlights, not legal advice. Users should consult qualified professionals before signing contracts.
