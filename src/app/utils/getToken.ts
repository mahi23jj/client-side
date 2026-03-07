export async function authenticateTelegram() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (!token) {
    return localStorage.getItem("token");
  }

  localStorage.setItem("token", token);

  params.delete("token");
  const query = params.toString();
  const newUrl = query
    ? `${window.location.pathname}?${query}${window.location.hash}`
    : `${window.location.pathname}${window.location.hash}`;

  if (window.history.replaceState) {
    window.history.replaceState({}, document.title, newUrl);
  }

  return token;
}
  