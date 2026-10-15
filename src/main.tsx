import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { isNative } from "./lib/platform";
import { getState, startLive, startSimulation } from "./lib/store";
import "./styles.css";

startSimulation();
if (getState().started && getState().mode === "live") startLive();

// Offline support for the web version (the Android app ships its files inside the app).
if (!isNative && "serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => void navigator.serviceWorker.register("sw.js"));
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
