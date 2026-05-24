/** Deployed Render backend — used when VITE_API_BASE_URL is unset in production builds */
const DEFAULT_PRODUCTION_API = 'https://random-shit.onrender.com';

function resolveApiBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  if (import.meta.env.PROD) return DEFAULT_PRODUCTION_API;
  return '';
}

const API_BASE_URL = resolveApiBaseUrl();
const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 120000);
const MAX_FILE_SIZE_MB = Number(import.meta.env.VITE_MAX_FILE_SIZE_MB || 10);
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const env = {
  API_BASE_URL,
  API_TIMEOUT_MS,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  isDev: import.meta.env.DEV,
};

export function apiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (API_BASE_URL) {
    return `${API_BASE_URL}${normalizedPath}`;
  }
  return normalizedPath;
}
