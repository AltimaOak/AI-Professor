// env.ts
// Centralized environment variable access for Vite

export const env = {
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  SSR: import.meta.env.SSR,

  // Add your custom variables here (must start with VITE_)
  API_URL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
  APP_TITLE: import.meta.env.VITE_APP_TITLE ?? "AI Professor",
};
