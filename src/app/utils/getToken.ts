const AUTH_DEBUG_PREFIX = "[AUTH][getToken]";

function maskToken(token: string | null): string {
  if (!token) return "<none>";
  if (token.length <= 12) return `${token.slice(0, 4)}...`;
  return `${token.slice(0, 8)}...${token.slice(-4)} (len=${token.length})`;
}

export async function authenticateTelegram() {
  const params = new URLSearchParams(window.location.search);
  console.log(`${AUTH_DEBUG_PREFIX} start`, {
    path: window.location.pathname,
    hasTokenInUrl: params.has("token"),
    queryKeys: Array.from(params.keys()),
  });

  const token = params.get("token");

  if (!token) {
    const storedToken = localStorage.getItem("token");
    console.log(`${AUTH_DEBUG_PREFIX} no token in URL, using localStorage`, {
      hasStoredToken: Boolean(storedToken),
      storedToken: maskToken(storedToken),
    });
    return storedToken;
  }

  localStorage.setItem("token", token);
  console.log(`${AUTH_DEBUG_PREFIX} saved token to localStorage`, {
    token: maskToken(token),
  });

  params.delete("token");
  const query = params.toString();
  const newUrl = query
    ? `${window.location.pathname}?${query}${window.location.hash}`
    : `${window.location.pathname}${window.location.hash}`;

  if (window.history.replaceState) {
    window.history.replaceState({}, document.title, newUrl);
    console.log(`${AUTH_DEBUG_PREFIX} removed token from URL`, {
      newUrl,
      hasTokenInNewUrl: new URLSearchParams(query).has("token"),
    });
  }

  console.log(`${AUTH_DEBUG_PREFIX} done`, { token: maskToken(token) });
  return token;
}
  