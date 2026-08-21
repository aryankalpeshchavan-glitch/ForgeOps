/// <reference types="vite/client" />

/**
 * Central environment configuration.
 * Vite exposes VITE_* variables via `import.meta.env`.
 * Never hardcode a production API URL.
 */
function resolveApiUrl(): string {
  const env = (import.meta.env as Record<string, string | undefined>) ?? {};
  const raw = env.VITE_API_URL;
  if (raw && raw.trim().length > 0) {
    return raw.trim().replace(/\/+$/, "");
  }
  // Local dev fallback only — production must set VITE_API_URL explicitly.
  return "http://127.0.0.1:8000";
}

export const API_URL = resolveApiUrl();