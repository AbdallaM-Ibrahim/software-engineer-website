import { defineConfig, devices } from "@playwright/test";

const CI = !!process.env.CI;

// Tests run against a production server by default (`next start`) — dev-mode cold
// compiles made runs slow and forced multi-minute timeouts. Set PW_DEV=1 to point
// the suite at `next dev` instead while iterating on components.
const DEV = !!process.env.PW_DEV;

export default defineConfig({
  testDir: "./tests/e2e",
  // Specs are read-only against the CMS, so they parallelise safely.
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "desktop",
      // Reuses the Chrome installed on this machine rather than downloading
      // Playwright's bundled Chromium. Drop `channel` after running
      // `npx playwright install chromium` if you'd prefer the bundled build.
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], channel: "chrome" },
    },
  ],
  webServer: {
    // Invoked through node against next's own entry point rather than `pnpm
    // start`: package managers are not guaranteed to be on PATH in the shell
    // Playwright forks, and a failed spawn surfaces only as
    // ERR_CONNECTION_REFUSED in every test rather than as a startup error.
    command: DEV
      ? "node node_modules/next/dist/bin/next dev"
      : "node node_modules/next/dist/bin/next start",
    url: "http://localhost:3000",
    reuseExistingServer: !CI,
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
