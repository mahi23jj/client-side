// src/services/clientApi.ts
const API_BASE_URL = "https://backend-ikou.onrender.com/api";

/**
 * Get token from URL query params
 */
function getTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (!token) {
    console.warn("No token found in URL");
  }
  return token;
}

/**
 * Wrapper fetch function for all API calls
 * @param endpoint API path, e.g., "/save_product"
 * @param options Fetch options (method, body, etc.)
 * @param token Optional token (if not provided, will read from URL)
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  token?: string
) {
  // Use provided token or read from URL
  const authToken = token || getTokenFromUrl();
  if (!authToken) throw new Error("No auth token found. Please login via Telegram bot.");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed (${response.status}): ${text}`);
  }

  return response.json();
}