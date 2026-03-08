import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import React from "react";
//import { BrowserRouter } from "react-router-dom";


// If the URL is "/debug", display the current URL in the body instead of rendering the app
// This is a temporary solution to display the current URL in the body

document.body.innerText = window.location.href;

// if (window.location.pathname === "/debug") {
//   document.body.innerText = window.location.href;
// } else {
//   createRoot(document.getElementById("root")!).render(<App />);
// }
