import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { isNative } from "./lib/platform";
import { actions, getState, startLive, startSimulation } from "./lib/store";
import "./styles.css";

/*
 * Entry link from the website: #/welcome (optionally #/welcome/bn or #/welcome/en) opens the welcome
 * screen with its two choices, the demo and "Sign in to my VenGuard", even if this browser was in the
 * demo before. Someone already signed in goes straight to their devices.
 */
const entry = location.hash.match(/^#\/welcome(?:\/(bn|en))?$/);
if (entry) {
  if (entry[1]) actions.setLang(entry[1] as "bn" | "en");
  if (!(getState().started && getState().mode === "live")) actions.showWelcome();
  history.replaceState(null, "", location.pathname + location.search + "#/");
}

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
