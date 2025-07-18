import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  optimizeDeps: {
    include: ["date-fns/esm"], // ESM modülünü doğrudan dahil et
  },
});
