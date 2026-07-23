import { test, expect, NEEDS_SEED } from "./fixtures";

// The contact links array replaced two hardcoded social fields, and the hero
// deliberately shows a subset of it. These assert that split holds against the
// seeded data: links = LinkedIn + GitHub, phone flagged as the WhatsApp number.
test.describe("contact links", () => {
  test.beforeEach(async ({ page, seeded }) => {
    test.skip(!seeded, NEEDS_SEED);
    await page.goto("/");
  });

  test("hero shows LinkedIn and WhatsApp, and nothing else", async ({
    page,
  }) => {
    const hero = page.locator("#top");

    await expect(hero.getByRole("link", { name: "LinkedIn" })).toBeVisible();
    await expect(
      hero.getByRole("link", { name: "Chat on WhatsApp" }),
    ).toBeVisible();

    // GitHub is in the links array but must not compete in the hero — it is
    // listed in the Contact section instead.
    await expect(hero.getByRole("link", { name: "GitHub" })).toHaveCount(0);
  });

  test("hero WhatsApp link is a wa.me deep link built from the phone number", async ({
    page,
  }) => {
    const chat = page.locator("#top").getByRole("link", {
      name: "Chat on WhatsApp",
    });

    // phoneIsWhatsapp is ticked, so the number itself becomes the chat link,
    // stripped to digits — no "+", spaces or dashes.
    await expect(chat).toHaveAttribute("href", /^https:\/\/wa\.me\/\d{7,}$/);
    await expect(chat).toHaveAttribute("target", "_blank");
    await expect(chat).toHaveAttribute("rel", /noopener/);
  });

  test("contact section lists every channel, hero ones included", async ({
    page,
  }) => {
    const contact = page.locator("#contact");

    await expect(contact.locator('a[href^="mailto:"]')).toHaveCount(1);
    await expect(contact.locator('a[href^="tel:"]')).toHaveCount(1);
    // The hero is a shortcut, not a move — the section stays the full directory.
    await expect(contact.locator('a[href*="linkedin.com"]')).not.toHaveCount(0);
    await expect(contact.locator('a[href*="github.com"]')).not.toHaveCount(0);
    await expect(contact.locator('a[href^="https://wa.me/"]')).toHaveCount(1);
  });

  test("WhatsApp is one row, distinct from the phone row", async ({ page }) => {
    const contact = page.locator("#contact");

    // Tapping "Phone" starts a call; "WhatsApp" opens a chat. Same number,
    // different intent, so both rows earn their place. Scoped to the link cards
    // so the contact form's channel <select> options (also "Phone"/"WhatsApp")
    // don't count as matches.
    await expect(
      contact.locator('a[href^="tel:"]').getByText("Phone", { exact: true }),
    ).toBeVisible();
    await expect(
      contact
        .locator('a[href^="https://wa.me/"]')
        .getByText("WhatsApp", { exact: true }),
    ).toBeVisible();
    await expect(contact.getByText("Start a chat")).toBeVisible();
  });

  test("every contact link opens safely in a new tab", async ({ page }) => {
    const external = page
      .locator("#contact")
      .locator('a[href^="http"]:not([href^="mailto"])');

    const count = await external.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(external.nth(i)).toHaveAttribute("target", "_blank");
      await expect(external.nth(i)).toHaveAttribute("rel", /noopener/);
    }
  });

  test("footer mirrors the links array", async ({ page }) => {
    const footer = page.locator("footer");

    await expect(footer.getByRole("link", { name: "LinkedIn" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "GitHub" })).toBeVisible();
  });
});
