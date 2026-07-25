import { test, expect, NEEDS_SEED } from "./fixtures";

// The contact links array replaced two hardcoded social fields, and the hero
// deliberately shows a subset of it. These assert that split holds against the
// seeded data: links = LinkedIn + GitHub, phone flagged as the WhatsApp number.
test.describe("contact links", () => {
  test.beforeEach(async ({ page, seeded }) => {
    test.skip(!seeded, NEEDS_SEED);
    await page.goto("/");
  });

  test("hero shows LinkedIn and GitHub, and nothing else", async ({ page }) => {
    const hero = page.locator("#top");

    await expect(hero.getByRole("link", { name: "LinkedIn" })).toBeVisible();
    await expect(hero.getByRole("link", { name: "GitHub" })).toBeVisible();

    // WhatsApp is a contact channel, not a hero shortcut — it lives in the
    // Contact section (merged into the phone card).
    await expect(hero.getByRole("link", { name: /WhatsApp/i })).toHaveCount(0);
  });

  test("phone card WhatsApp badge is a wa.me deep link from the phone number", async ({
    page,
  }) => {
    // phoneIsWhatsapp is ticked, so the number itself becomes the chat link,
    // stripped to digits — and it rides as a badge on the phone card rather
    // than a card of its own.
    const badge = page
      .locator("#contact")
      .getByRole("link", { name: "WhatsApp" });

    await expect(badge).toHaveAttribute("href", /^https:\/\/wa\.me\/\d{7,}$/);
    await expect(badge).toHaveAttribute("target", "_blank");
    await expect(badge).toHaveAttribute("rel", /noopener/);
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

  test("same number: one phone card with a WhatsApp badge, no separate card", async ({
    page,
  }) => {
    const contact = page.locator("#contact");

    // Tapping the row calls; the badge on it opens WhatsApp — one card carries
    // the number for both, since phoneIsWhatsapp is ticked.
    await expect(
      contact.locator('a[href^="tel:"]').getByText("Phone", { exact: true }),
    ).toBeVisible();
    // Exactly one wa.me link (the badge), not a second card.
    await expect(contact.locator('a[href^="https://wa.me/"]')).toHaveCount(1);
    await expect(contact.getByRole("link", { name: "WhatsApp" })).toHaveCount(
      1,
    );
    // The generic "start a chat" card is gone — the number lives on the phone card.
    await expect(contact.getByText("Start a chat")).toHaveCount(0);
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
