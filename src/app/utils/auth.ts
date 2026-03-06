// src/utils/auth.ts

/**
 * Extract the Telegram Web App token from the URL
 */
export function getTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (!token) {
    console.warn("No token found in URL");
  } else {
    console.log("Extracted token from URL:", token);
  }
  return token;
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
  const token = getTokenFromUrl();
  if (!token) throw new Error("No auth token found. Please login via Telegram bot.");
  return token;
}