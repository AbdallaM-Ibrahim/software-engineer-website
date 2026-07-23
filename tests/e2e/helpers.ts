import type { Page } from "@playwright/test";

/** Environmental noise that isn't an app defect. */
const IGNORED = [
  /favicon/i,
  /Failed to load resource.*\b404\b/i,
  // Next dev-server HMR / websocket chatter (only present with PW_DEV=1).
  /websocket/i,
  /\[Fast Refresh\]/i,
];

/**
 * Start collecting console errors and uncaught page errors. Attach before
 * navigating; read the returned array after the page has rendered.
 */
export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}

export function significantErrors(errors: string[]): string[] {
  return errors.filter((e) => !IGNORED.some((p) => p.test(e)));
}
