import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { App } from "./App";
import { AppProviders } from "./AppProviders";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
        <Analytics />
        <SpeedInsights />
      </AppProviders>
    </BrowserRouter>
  </StrictMode>,
);
