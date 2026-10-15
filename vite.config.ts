/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pkg from "./package.json";

// base "./" keeps every asset path relative, so the same build works on
// GitHub Pages (/venguard-app/) and inside the Android app (Capacitor).
export default defineConfig({
  base: "./",
  plugins: [react()],
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  build: {
    outDir: "dist",
    sourcemap: false,
    // Two pages: the app, and the device simulator used for demos and firmware work.
    rollupOptions: { input: { main: "index.html", simulator: "simulator.html" } },
  },
  test: { environment: "node" },
});
