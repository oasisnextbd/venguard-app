import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { isNative } from "./lib/platform";
import { actions, getState, startLive } from "./lib/store";
import { startUpdates } from "./lib/updates";
import "./styles.css";

/*
 * Entry link from the website: #/welcome (optionally #/welcome/bn or #/welcome/en) sets the language
 * and opens the welcome screen (logo, tagline, "Sign in to my VenGuard"). Someone who already passed
 * it goes straight on: to their devices when signed in, else to sign-in.
 */
const entry = location.hash.match(/^#\/welcome(?:\/(bn|en))?$/);
if (entry) {
  if (entry[1]) actions.setLang(entry[1] as "bn" | "en");
  history.replaceState(null, "", location.pathname + location.search + "#/");
}

void startUpdates();
if (getState().started) startLive();

// Offline support for the web version (the Android app ships its files inside the app).
if (!isNative && "serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => void navigator.serviceWorker.register("sw.js"));
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
