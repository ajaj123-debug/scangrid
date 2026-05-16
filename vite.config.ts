import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    port: 3000,
    allowedHosts: ["subapostolic-sam-injunctively.ngrok-free.dev"],
  },
  resolve: {
    alias: {
      "@": path.join(root, "src"),
    },
    tsconfigPaths: true,
    dedupe: ["react", "react-dom"],
  },
  plugins: [
    tailwindcss(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({
      server: { entry: "server" },
    }),
    viteReact(),
  ],
});
