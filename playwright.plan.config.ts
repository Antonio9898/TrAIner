import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

export default defineConfig({
  ...config,
  testMatch: "training-plan-journey.spec.ts",
  testIgnore: [],
  use: { ...config.use, baseURL: "http://127.0.0.1:4323" },
  webServer: {
    command: "node --experimental-strip-types tests/e2e/support/llm-server.ts",
    url: "http://127.0.0.1:4323/auth/signin",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
