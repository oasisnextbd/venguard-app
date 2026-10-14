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
  build: { outDir: "dist", sourcemap: false },
  test: { environment: "node" },
});
