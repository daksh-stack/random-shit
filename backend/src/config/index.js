const path = require('path');
require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  isProduction: process.env.NODE_ENV === 'production',

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    timeoutMs: Number(process.env.GEMINI_TIMEOUT_MS || 30000),
    maxRetries: Number(process.env.GEMINI_MAX_RETRIES || 1),
  },

  upload: {
    maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 10),
    maxFileSizeBytes: Number(process.env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024,
  },

  analysis: {
    maxClausesForAi: Number(process.env.MAX_CLAUSES_FOR_AI || 10),
    minConfidence: Number(process.env.MIN_CONFIDENCE || 0.35),
    minTextLength: Number(process.env.MIN_TEXT_LENGTH || 50),
    ocrFallbackThreshold: Number(process.env.OCR_FALLBACK_THRESHOLD || 100),
    excerptMaxChars: Number(process.env.EXCERPT_MAX_CHARS || 700),
    aiBatchSize: Number(process.env.AI_BATCH_SIZE || 5),
  },

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    max: Number(process.env.RATE_LIMIT_MAX || 30),
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },

  requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS || 120000),

  paths: {
    tempDir: path.resolve(process.cwd(), process.env.TEMP_DIR || 'temp'),
    root: process.cwd(),
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  promptVersion: process.env.PROMPT_VERSION || '1',
};

module.exports = config;
