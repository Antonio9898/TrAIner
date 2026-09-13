// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "server",
  // src/middleware.ts preserves form-origin protection and gives plan APIs their JSON/303 contract.
  security: { checkOrigin: false },
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: cloudflare(),
  env: {
    schema: {
      SUPABASE_URL: envField.string({ context: "server", access: "secret", optional: true }),
      SUPABASE_KEY: envField.string({ context: "server", access: "secret", optional: true }),
      // Validate in the AI client so missing configuration returns a controlled 503.
      OPENROUTER_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
      // Read the model from Worker bindings at runtime, like the API key.
      OPENROUTER_MODEL: envField.string({ context: "server", access: "secret", optional: true }),
      OPENROUTER_HTTP_REFERER: envField.string({ context: "server", access: "public", optional: true }),
    },
  },
});
