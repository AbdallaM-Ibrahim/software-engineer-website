import { test, expect, NEEDS_SEED } from "./fixtures";

// What the contact form puts on the wire, and how it handles the answer.
// Every test stubs /api/contact — the suite must never send real mail, and
// stubbing keeps these read-only like the rest of the specs so they still
// parallelise.
test.describe("contact form submission", () => {
  test.beforeEach(async ({ page, seeded }) => {
    test.skip(!seeded, NEEDS_SEED);
    await page.goto("/");
  });

  test("posts the entered values as JSON", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, id: "test-email-id" }),
      }),
    );

    const request = page.waitForRequest(
      (req) => req.url().includes("/api/contact") && req.method() === "POST",
    );

    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@company.com");
    await page
      .getByLabel("Message")
      .fill("A message long enough to clear validation.");
    await page.getByRole("button", { name: /Send message/i }).click();

    const body = (await request).postDataJSON();
    expect(body).toMatchObject({
      name: "Jane Doe",
      email: "jane@company.com",
      message: "A message long enough to clear validation.",
    });
    // The honeypot must ride along empty — a bot filling it is the only
    // way it should ever carry a value.
    expect(body.company).toBe("");
  });

  test("surfaces a server failure instead of claiming success", async ({
    page,
  }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Could not send your message. Please try again.",
        }),
      }),
    );

    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@company.com");
    await page
      .getByLabel("Message")
      .fill("A message long enough to clear validation.");
    await page.getByRole("button", { name: /Send message/i }).click();

    await expect(
      page.getByText("Could not send your message. Please try again."),
    ).toBeVisible();
    // Input is preserved on failure so the visitor doesn't retype it.
    await expect(page.getByLabel("Name")).toHaveValue("Jane Doe");
  });

  test("honeypot field is hidden from users and assistive tech", async ({
    page,
  }) => {
    const honeypot = page.locator("#contact-company");
    await expect(honeypot).toBeHidden();
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
  });

  test("does not submit when validation fails", async ({ page }) => {
    let called = false;
    await page.route("**/api/contact", (route) => {
      called = true;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.getByLabel("Name").fill("J");
    await page.getByLabel("Email").fill("nope");
    await page.getByLabel("Message").fill("too short");
    await page.getByRole("button", { name: /Send message/i }).click();

    await expect(page.getByText("Please enter your name.")).toBeVisible();
    expect(called).toBe(false);
  });
});
