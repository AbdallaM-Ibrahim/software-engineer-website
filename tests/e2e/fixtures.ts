import { test as base, request, expect } from "@playwright/test";

type WorkerFixtures = {
  /**
   * Whether Payload actually has portfolio content.
   *
   * The homepage falls back to an "No content yet" EmptyState when the `profile`
   * global is missing — which is also what an unreachable database looks like.
   * Content and interaction specs skip themselves (with a reason) rather than
   * reporting a false pass in that state.
   *
   * Worker-scoped: one REST call per worker instead of a page load per test.
   */
  seeded: boolean;
};

export const test = base.extend<object, WorkerFixtures>({
  seeded: [
    // biome-ignore lint/correctness/noEmptyPattern: Playwright parses this argument to work out which fixtures a test uses, so it must be an object destructuring pattern even when empty. Renaming it to `_fixtures` makes Playwright reject the fixture at runtime.
    async ({}, use, workerInfo) => {
      const baseURL = workerInfo.project.use.baseURL;
      const ctx = await request.newContext({ baseURL });
      let seeded = false;
      try {
        const res = await ctx.get("/api/globals/profile?depth=0");
        if (res.ok()) {
          const body = await res.json();
          seeded = typeof body?.name === "string" && body.name.length > 0;
        }
      } catch {
        seeded = false;
      } finally {
        await ctx.dispose();
      }
      await use(seeded);
    },
    { scope: "worker" },
  ],
});

export { expect };

export const NEEDS_SEED =
  "Payload has no profile — run `pnpm seed` against a reachable MongoDB";
