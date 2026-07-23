import { test, expect } from "./fixtures";
import { collectErrors, significantErrors } from "./helpers";

// Runs regardless of database state — covers the app shell, metadata and the
// Payload route groups.
test.describe("smoke", () => {
  test("homepage responds 200 and renders the shell", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("body")).toBeVisible();
  });

  test("document metadata comes from the bio", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Abdalla Mostafa/i);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /Senior Software Engineer/i,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /Abdalla Mostafa/i,
    );
  });

  test("homepage renders without console errors", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/");
    // Wait on a real element rather than networkidle (discouraged, and flaky).
    await expect(page.locator("body")).toBeVisible();
    expect(significantErrors(errors)).toEqual([]);
  });

  test("Payload admin route is served", async ({ page }) => {
    const res = await page.goto("/admin");
    expect(res?.status()).not.toBe(404);
    expect(res?.status()).toBeLessThan(500);
    // Payload's admin renders either a login or a create-first-user form.
    await expect(
      page
        .getByRole("textbox", { name: /email/i })
        .or(page.locator("#field-email")),
    ).toBeVisible();
  });

  test("REST API route group is mounted", async ({ request }) => {
    const res = await request.get("/api/users/me");
    expect(res.status()).not.toBe(404);
    expect(res.ok()).toBe(true);
  });

  test("GraphQL route group is mounted", async ({ request }) => {
    const res = await request.post("/api/graphql", {
      data: { query: "{ __typename }" },
    });
    expect(res.status()).not.toBe(404);
  });

  test("robots.txt allows the site and blocks the CMS", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.ok()).toBe(true);

    const body = await res.text();
    expect(body).toContain("Allow: /");
    expect(body).toContain("Disallow: /admin");
    expect(body).toMatch(/Sitemap: https?:\/\/\S+\/sitemap\.xml/);
  });

  test("sitemap.xml lists the canonical URL", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.ok()).toBe(true);

    const body = await res.text();
    expect(body).toContain("<urlset");
    expect(body).toMatch(/<loc>https?:\/\/\S+<\/loc>/);
  });

  test("a favicon is linked and served", async ({ page, request }) => {
    await page.goto("/");
    // Next fingerprints app icons (/icon-<hash>.svg), so read the emitted link.
    const href = await page
      .locator('link[rel="icon"]')
      .first()
      .getAttribute("href");
    expect(href).toBeTruthy();

    const res = await request.get(href!);
    expect(res.ok()).toBe(true);
  });
});
