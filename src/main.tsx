import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";


createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClient}>
		<App />
	</QueryClientProvider>
);
