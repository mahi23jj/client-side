// src/utils/auth.ts
export function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  console.log("Extracted token from URL:", token);
  return token;
}
