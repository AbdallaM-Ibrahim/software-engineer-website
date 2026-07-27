import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests for the pure modules — the section registry, the nav model, the
// heading ids. They sit beside the `model/` segment they pin, so a feature
// carries its own tests rather than leaving them in a directory that has to be
// kept in step by hand. `environment: "node"` because nothing here touches a
// DOM; anything needing a browser belongs in `tests/e2e` under Playwright.
//
// The suffixes are load-bearing: Vitest owns `*.test.ts`, Playwright owns
// `*.spec.ts`. Neither runner globs the other's files.
export default defineConfig({
  resolve: {
    // Mirrors the `@/*` path in tsconfig.json. Done by hand rather than with
    // vite-tsconfig-paths — it is two lines and one fewer dependency.
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
