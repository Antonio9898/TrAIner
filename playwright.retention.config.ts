import { randomUUID } from "node:crypto";
import { defineConfig } from "@playwright/test";
import { APP_URL, loadLocalEnvironment } from "./tests/integration/plan-retention/support/environment";

// Fail before starting the app or creating users, including on --list.
loadLocalEnvironment();
process.env.RETENTION_CONTROL_TOKEN ??= randomUUID();

export default defineConfig({
  testDir: "./tests/integration/plan-retention",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: !!process.env.CI,
  timeout: 45_000,
  expect: { timeout: 5_000 },
  reporter: "list",
  outputDir: "test-results/retention",
  use: { baseURL: APP_URL, trace: "off" },
  webServer: {
    command: "node --experimental-strip-types tests/integration/plan-retention/support/server.ts",
    url: `${APP_URL}/auth/signin`,
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
