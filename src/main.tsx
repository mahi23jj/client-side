import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import React from "react";


document.body.innerText = window.location.href;

// if (window.location.pathname === "/debug") {
//   document.body.innerText = window.location.href;
// } else {
//   createRoot(document.getElementById("root")!).render(<App />);
// }
