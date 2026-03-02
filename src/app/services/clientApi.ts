// src/services/clientApi.ts
const API_BASE_URL = "https://backend-ikou.onrender.com/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}, token?: string) {
  if (!token) throw new Error("No auth token found. Please login via Telegram bot.");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...options,
  });

  if (!response.ok) throw new Error("Request failed");

  return response.json();
}