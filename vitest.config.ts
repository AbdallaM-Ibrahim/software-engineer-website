import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests for the pure modules — the section registry and the nav model.
// Deliberately narrow: `environment: "node"` because nothing here touches a DOM,
// and the include glob is limited to `tests/unit`. Anything needing a browser
// belongs in `tests/e2e` under Playwright.
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
    include: ["tests/unit/**/*.test.ts"],
  },
});
