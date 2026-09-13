import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testIgnore: "training-plan-journey.spec.ts", // Uses the isolated LLM launcher in playwright.plan.config.ts.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4322",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // The API keeps Astro in the foreground, including when run by a coding agent.
    command: `node --input-type=module -e "import { dev } from 'astro'; await dev({ server: { host: '127.0.0.1', port: 4322 } });"`,
    url: "http://127.0.0.1:4322/auth/signin",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
