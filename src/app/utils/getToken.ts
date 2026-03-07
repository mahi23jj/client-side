export async function authenticateTelegram() {
    // Read token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
  
    if (!token) {
      console.error("No token found in URL");
      return;
    }
  
    console.log("Token from URL:", token);
  
    try {
      // Optional: validate token with backend (recommended)
      const res = await fetch(`https://backend-ikou.onrender.com/api/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (!res.ok) throw new Error("Token validation failed");
  
      const data = await res.json();
      console.log("User data:", data);
  
      // Save token locally for API calls
      localStorage.setItem("token", token);
    } catch (err) {
      console.error("Token validation failed", err);
    } finally {
      // Remove token from URL for security
      if (window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }
  