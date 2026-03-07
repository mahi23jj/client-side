// src/utils/auth.ts

const AUTH_TOKEN_KEY = "token";

/**
 * Extract the Telegram Web App token from the URL
 */
export function getTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("token");
}

export function getTokenFromStorage(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Remove token from URL for security
 */
export function removeTokenFromUrl() {
  if (window.history.replaceState) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

/**
 * Optional: get token safely for API calls
 * Reads from URL (preferred) or fallback state/localStorage if needed
 */
export function getToken(): string {
  const token = getTokenFromUrl() || getTokenFromStorage();
  if (!token) throw new Error("No auth token found. Please login via Telegram bot.");
  return token;
}