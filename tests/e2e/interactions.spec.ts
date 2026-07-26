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

  test("valid submission shows the success toast and resets", async ({
    page,
  }) => {
    // Stubbed so the suite never sends real mail through Resend.
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, id: "test-email-id" }),
      }),
    );

    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@company.com");
    await page
      .getByLabel("Message")
      .fill("This is a long enough message body.");
    await page.getByRole("button", { name: /Send message/i }).click();

    await expect(page.getByText("Message sent.")).toBeVisible();
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

    // The panel is a popover now rather than a sheet, but role="dialog" is an
    // ARIA contract both satisfy, so this is not a primitive detail.
    const panel = page.getByRole("dialog");
    await expect(panel).toBeVisible();
    for (const label of ["About", "Skills", "Experience", "Work", "Contact"]) {
      await expect(
        panel.getByRole("link", { name: label, exact: true }),
      ).toBeVisible();
    }
  });
});

test.describe("nav state", () => {
  test.beforeEach(async ({ seeded }) => {
    test.skip(!seeded, NEEDS_SEED);
  });

  test("the skip link is the first thing a keyboard reaches", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();

    await skip.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("the active mark never blanks between sections", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "desktop", "desktop-only navigation");
    await page.goto("/");

    // Education and Availability sit between Experience and Work. They were
    // tracked by nothing, so the mark vanished while they were being read.
    for (const id of ["education", "availability"]) {
      const section = page.locator(`#${id}`);
      if ((await section.count()) === 0) continue;

      await section.evaluate((element) =>
        element.scrollIntoView({ block: "center" }),
      );
      await expect(page.locator("header [aria-current]")).toHaveCount(1);
    }
  });

  test("Services is marked and inert on the hub", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "desktop-only navigation");
    await page.goto("/services");

    const header = page.locator("header");
    await expect(header.locator('[aria-current="page"]')).toHaveCount(1);
    // Not a link: a click would navigate to the page you are already on.
    await expect(
      header.getByRole("link", { name: "Services", exact: true }),
    ).toHaveCount(0);
  });

  test("Services links up to the hub from a detail page", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "desktop", "desktop-only navigation");
    await page.goto("/services");
    await page.locator("main a[href*='/services/']").first().click();
    await expect(page).toHaveURL(/\/services\/.+/);

    const header = page.locator("header");
    const services = header.getByRole("link", {
      name: "Services",
      exact: true,
    });
    await expect(services).toHaveAttribute("href", "/services");
    await expect(services).toHaveAttribute("aria-current", "true");

    // The call to action stays on the page: this page's own WhatsApp and email
    // block is the conversion point, not the home form.
    await expect(
      header.getByRole("link", { name: "Contact", exact: true }),
    ).toHaveAttribute("href", "#contact");
  });
});
