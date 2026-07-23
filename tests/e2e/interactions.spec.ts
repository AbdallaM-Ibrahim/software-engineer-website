import { test, expect, NEEDS_SEED } from "./fixtures";

// Interactive behaviour. Requires seeded content — the navbar and sections only
// render once a profile exists.
test.describe("interactions", () => {
  test.beforeEach(async ({ page, seeded }) => {
    test.skip(!seeded, NEEDS_SEED);
    await page.goto("/");
  });

  test("theme toggle flips light and dark", async ({ page }) => {
    const html = page.locator("html");
    const toggle = page.getByRole("button", { name: "Toggle theme" });

    await expect(html).toHaveClass(/light/);
    await toggle.click();
    await expect(html).toHaveClass(/dark/);
    await toggle.click();
    await expect(html).toHaveClass(/light/);
  });

  test("case-study dialog opens with the full STAR breakdown", async ({
    page,
  }) => {
    await page
      .getByRole("button", { name: /Case study/i })
      .first()
      .click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    for (const label of ["Situation", "Task", "Action", "Result"]) {
      await expect(dialog.getByRole("heading", { name: label })).toBeVisible();
    }

    // Result leads — the payoff shouldn't sit at the bottom of the dialog.
    const order = await dialog
      .getByRole("heading", { level: 4 })
      .allTextContents();
    expect(order[0]).toBe("Result");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("contact form reports every missing field", async ({ page }) => {
    await page.getByRole("button", { name: /Send message/i }).click();

    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please enter a valid email.")).toBeVisible();
    await expect(
      page.getByText("Message should be at least 10 characters."),
    ).toBeVisible();
  });

  test("contact form rejects a malformed email", async ({ page }) => {
    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("not-an-email");
    await page
      .getByLabel("Message")
      .fill("This is a long enough message body.");
    await page.getByRole("button", { name: /Send message/i }).click();

    await expect(page.getByText("Please enter a valid email.")).toBeVisible();
  });

  test("valid submission shows the stub success toast and resets", async ({
    page,
  }) => {
    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@company.com");
    await page
      .getByLabel("Message")
      .fill("This is a long enough message body.");
    await page.getByRole("button", { name: /Send message/i }).click();

    await expect(
      page.getByText("Thanks! Your message has been noted."),
    ).toBeVisible();
    await expect(page.getByLabel("Name")).toHaveValue("");
  });
});

test.describe("navigation", () => {
  test.beforeEach(async ({ page, seeded }) => {
    test.skip(!seeded, NEEDS_SEED);
    await page.goto("/");
  });

  test("desktop nav anchors scroll to their section", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "desktop", "desktop-only navigation");

    await page.getByRole("link", { name: "Work", exact: true }).click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.locator("#work")).toBeInViewport({ ratio: 0.05 });
  });

  test("mobile menu opens and lists the sections", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "mobile-only menu");

    await page.getByRole("button", { name: "Open menu" }).click();

    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();
    for (const label of ["About", "Skills", "Experience", "Work", "Contact"]) {
      await expect(
        sheet.getByRole("link", { name: label, exact: true }),
      ).toBeVisible();
    }
  });
});
