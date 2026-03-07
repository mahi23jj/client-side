export async function authenticateTelegram() {
    const tg = (window as any).Telegram?.WebApp;
  
    if (!tg) {
      console.error("Not running inside Telegram");
      return;
    }
  
    tg.ready();
  
    const initData = tg.initData;
    
  
    if (!initData) {
      console.error("Telegram initData missing");
      return;
    }
  
    console.log("Authenticating with Telegram");
  
    const res = await fetch("https://backend-ikou.onrender.com/auth/telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ initData }),
    });
  
    if (!res.ok) {
      throw new Error("Auth request failed");
    }
  
    const data = await res.json();
  
    localStorage.setItem("token", data.token);
  
    console.log("User authenticated");
  }
  