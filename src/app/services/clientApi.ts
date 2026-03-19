/*import { authenticateTelegram } from "../utils/getToken";


const API_BASE_URL = "https://backend-ikou.onrender.com/api";

const AUTH_DEBUG_PREFIX = "[AUTH][apiFetch]";

function maskToken(token: string | null | undefined): string {
  if (!token) return "<none>";
  if (token.length <= 12) return `${token.slice(0, 4)}...`;
  return `${token.slice(0, 8)}...${token.slice(-4)} (len=${token.length})`;
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  console.log(`${AUTH_DEBUG_PREFIX} request start`, {
    endpoint,
    method: options.method || "GET",
  });


  const authToken = await authenticateTelegram();

  console.log(`${AUTH_DEBUG_PREFIX} token resolved`, {
    token: maskToken(authToken),
  });

  // ❗ Important: handle missing token
  if (!authToken) {
    console.error(`${AUTH_DEBUG_PREFIX} NO TOKEN FOUND`);
    throw new Error("Authentication token missing. Open from Telegram.");
  }

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
}*/

// src/services/clientApi.ts
const API_BASE_URL = "https://backend-ikou.onrender.com/api";

// 🔑 Hardcoded token here
const HARDCODED_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOGIxZmI5Ny1iYmU0LTQwYWUtOTJmYS1iZjM3M2IxYmJmNzUiLCJyb2xlIjoiVVNFUiIsInVzZXJuYW1lIjoia3VrdSIsImlhdCI6MTc3MzQ5MjM0NiwiZXhwIjoxNzc0MDk3MTQ2fQ.YOUV_rQMk0UWcdTtgsAkVGZn478C0quqFem-hp4vpqs";

const AUTH_DEBUG_PREFIX = "[AUTH][apiFetch]";

function maskToken(token: string | null | undefined): string {
  if (!token) return "<none>";
  if (token.length <= 12) return `${token.slice(0, 4)}...`;
  return `${token.slice(0, 8)}...${token.slice(-4)} (len=${token.length})`;
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  console.log(`${AUTH_DEBUG_PREFIX} request start`, {
    endpoint,
    method: options.method || "GET",
  });

  const authToken = HARDCODED_TOKEN;

  console.log(`${AUTH_DEBUG_PREFIX} using hardcoded token`, {
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
