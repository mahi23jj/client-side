// src/services/clientApi.ts
const API_BASE_URL = "https://backend-ikou.onrender.com/api";
import { getToken } from "../utils/auth";

const AUTH_DEBUG_PREFIX = "[AUTH][apiFetch]";

function maskToken(token: string | null | undefined): string {
  if (!token) return "<none>";
  if (token.length <= 12) return `${token.slice(0, 4)}...`;
  return `${token.slice(0, 8)}...${token.slice(-4)} (len=${token.length})`;
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
  console.log(`${AUTH_DEBUG_PREFIX} request start`, {
    endpoint,
    method: options.method || "GET",
    hasExplicitToken: Boolean(token),
  });

  const authToken = token || getToken();
  if (!authToken) throw new Error("No auth token found. Please login via Telegram bot.");

  console.log(`${AUTH_DEBUG_PREFIX} resolved token`, {
    tokenSource: token ? "function-arg" : "auth-utils",
    token: maskToken(authToken),
  });

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`${AUTH_DEBUG_PREFIX} request failed`, {
      endpoint,
      status: response.status,
      bodyPreview: text.slice(0, 200),
    });
    throw new Error(`Request failed (${response.status}): ${text}`);
  }

  console.log(`${AUTH_DEBUG_PREFIX} request success`, {
    endpoint,
    status: response.status,
  });

  return response.json();
}