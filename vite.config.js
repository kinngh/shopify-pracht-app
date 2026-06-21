import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { pracht } from "@pracht/vite-plugin";
import { nodeAdapter } from "@pracht/adapter-node";
import "dotenv/config";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  define: {
    "process.env.CONFIG_SHOPIFY_API_KEY": JSON.stringify(
      process.env.SHOPIFY_API_KEY ?? ""
    ),
    "process.env.CONFIG_SHOPIFY_APP_URL": JSON.stringify(
      process.env.SHOPIFY_APP_URL ?? ""
    ),
    "process.env.CONFIG_SHOPIFY_API_OPTIONAL_SCOPES": JSON.stringify(
      JSON.stringify(process.env.SHOPIFY_API_OPTIONAL_SCOPES ?? "")
    ),
  },
  resolve: {
    alias: {
      "@": root,
      react: "preact/compat",
      "react-dom": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
  plugins: [pracht({ pagesDir: "/src/pages", adapter: nodeAdapter() })],
  server: {
    allowedHosts: [`${process.env.SHOPIFY_APP_URL?.replace(/https:\/\//, "")}`],
    cors: false,
  },
});
