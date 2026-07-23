import { defineConfig, devices } from "@playwright/test";

const CI = !!process.env.CI;

// Tests run against a production server by default (`next start`) — dev-mode cold
// compiles made runs slow and forced multi-minute timeouts. Set PW_DEV=1 to point
// the suite at `next dev` instead while iterating on components.
const DEV = !!process.env.PW_DEV;

const PORT = Number(process.env.PW_PORT ?? 3000);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./test-results",

  /* Execution
     Specs are read-only against the CMS, so they parallelise safely. CI runs a
     single worker because every worker shares one MongoDB and one Next server. */
  fullyParallel: true,
  workers: CI ? 1 : undefined,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  // Stop a broken CI run early instead of burning minutes on 60 identical failures.
  maxFailures: CI ? 10 : undefined,

  /* Timeouts
     Per-test and per-assertion. actionTimeout/navigationTimeout are set so a
     hung click reports as that action timing out rather than as the whole test
     dying with no useful frame. */
  timeout: 30_000,
  globalTimeout: CI ? 20 * 60_000 : undefined,
  expect: { timeout: 10_000 },

  reporter: CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: BASE_URL,
    actionTimeout: 10_000,
    navigationTimeout: 20_000,

    /* Determinism
       The app formats dates through toLocaleString, and specs assert on the
       rendered text. Pinning locale and timezone keeps a run on a developer
       machine identical to a run in CI. */
    locale: "en-GB",
    timezoneId: "UTC",

    /* Failure artefacts — cheap on green runs, kept only when something breaks. */
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: CI ? "retain-on-failure" : "off",
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
      ? `node node_modules/next/dist/bin/next dev --port ${PORT}`
      : `node node_modules/next/dist/bin/next start --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !CI,
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
