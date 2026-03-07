export async function authenticateTelegram() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (!token) {
    return localStorage.getItem("token");
  }

  localStorage.setItem("token", token);

  // try {
  //   const res = await fetch("https://backend-ikou.onrender.com/auth/me", {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });

  //   if (!res.ok) {
  //     throw new Error("Token validation failed");
  //   }
  // } catch (err) {
  //   console.error("Token validation failed", err);
  // } finally {
  //   params.delete("token");
  //   const query = params.toString();
  //   const newUrl = query
  //     ? `${window.location.pathname}?${query}${window.location.hash}`
  //     : `${window.location.pathname}${window.location.hash}`;

  //   if (window.history.replaceState) {
  //     window.history.replaceState({}, document.title, newUrl);
  //   }
  // }

  return token;
}
  