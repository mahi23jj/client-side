export async function authenticateTelegram() {
    const tg = (window as any).Telegram?.WebApp;
  
    if (!tg) {
      console.error("Telegram WebApp not found");
      return;
    }
  
    const initData = tg.initData;
    console.log("Telegram initData:", initData);
  
    try {
      const res = await fetch("https://backend-ikou.onrender.com/auth/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ initData })
      });
  
      const data = await res.json();
      console.log("Telegram auth response:", data);
  
      localStorage.setItem("token", data.token);
    } catch (err) {
      console.error("Telegram auth failed", err);
    }
  }