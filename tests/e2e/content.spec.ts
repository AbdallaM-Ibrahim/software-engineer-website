import { test, expect, NEEDS_SEED } from "./fixtures";

// Assertions against the real portofolio.json data seeded into Payload.
test.describe("seeded content", () => {
  test.beforeEach(async ({ page, seeded }) => {
    test.skip(!seeded, NEEDS_SEED);
    await page.goto("/");
  });

  test("hero shows the name, headline and calls to action", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Abdalla Mostafa" }),
    ).toBeVisible();
    // Root-relative, not a bare fragment: the same markup renders on the
    // service pages, where "#work" alone would point nowhere.
    await expect(
      page.getByRole("link", { name: /View my work/i }),
    ).toHaveAttribute("href", "/#work");
    await expect(
      page.getByRole("link", { name: /Get in touch/i }),
    ).toHaveAttribute("href", "/#contact");
  });

  test("hero leads with the case-study metrics", async ({ page }) => {
    const strip = page.locator("#top dl");
    await expect(strip).toBeVisible();
    // Figures come from the case studies, so they must match what the cards show.
    await expect(strip).toContainText("13,000");
    await expect(strip).toContainText("60%");
    await expect(strip).toContainText("80%");
    await expect(strip.locator("dd")).toHaveCount(3);
  });

  test("every section is rendered exactly once", async ({ page }) => {
    for (const id of [
      "top",
      "about",
      "skills",
      "experience",
      "education",
      "work",
      "contact",
    ]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test("testimonials stay hidden while there are no real quotes", async ({
    page,
  }) => {
    // Placeholder quotes are filtered out, so the section — and its nav link —
    // must be absent rather than showing fabricated social proof.
    await expect(page.locator("#testimonials")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Testimonials" })).toHaveCount(
      0,
    );
  });

  test("section headers carry a real count", async ({ page }) => {
    await expect(page.locator("#work")).toContainText("3 case studies");
    await expect(page.locator("#experience")).toContainText("2 roles");
    await expect(page.locator("#education")).toContainText("1 degree");
  });

  test("experience lists both employers", async ({ page }) => {
    const experience = page.locator("#experience");
    await expect(experience).toContainText("swegit inc.");
    await expect(experience).toContainText("NextGen Softwares");
  });

  test("education entry renders", async ({ page }) => {
    await expect(page.locator("#education")).not.toBeEmpty();
  });

  test("skills shows both groups without a click", async ({ page }) => {
    const skills = page.locator("#skills");

    // Previously tabbed, which hid half the content behind an interaction.
    await expect(skills.getByRole("tab")).toHaveCount(0);
    await expect(skills).toContainText("Stripe");
    await expect(skills).toContainText("AWS Lambda");

    for (const skill of [
      "Problem Solving",
      "Clear Communication",
      "Feature Customization",
      "Process Automation",
    ]) {
      await expect(skills).toContainText(skill);
    }
  });

  test("all three case studies render with a screenshot and a metric", async ({
    page,
  }) => {
    const work = page.locator("#work");
    await expect(work).toContainText("Westbazaar");
    await expect(work).toContainText("JobSolv");
    await expect(work).toContainText("EasyGo");
    await expect(work.getByRole("button", { name: /Case study/i })).toHaveCount(
      3,
    );

    // Real screenshots replaced the gradient placeholders.
    await expect(work.locator("img")).toHaveCount(3);
    // Each card surfaces its headline number instead of truncated prose.
    await expect(work).toContainText("13,000");
    await expect(work).toContainText("60%");
    await expect(work).toContainText("80%");
  });

  test("contact exposes email and social links", async ({ page }) => {
    const contact = page.locator("#contact");
    await expect(contact.locator('a[href^="mailto:"]')).toHaveCount(1);
    await expect(contact.locator('a[href*="linkedin.com"]')).not.toHaveCount(0);
  });

  // Content is rendered at opacity-0 and revealed by an IntersectionObserver, so
  // "present in the DOM" is not the same as "the user can see it". Assert the
  // reveal actually fires — a toContainText check alone would miss this.
  test("sections become visible once scrolled into view", async ({ page }) => {
    for (const id of ["about", "skills", "experience", "work", "contact"]) {
      // Scroll the reveal itself, not the section: the sections are tall, so
      // scrolling one into view can leave its first child inside the observer's
      // -80px bottom margin and the reveal never fires.
      const reveal = page.locator(`#${id} [data-reveal]`).first();
      await reveal.scrollIntoViewIfNeeded();

      await expect(reveal).toHaveAttribute("data-reveal", "shown");
      await expect(reveal).toHaveCSS("opacity", "1");
    }
  });

  test("case-study links open in a new tab safely", async ({ page }) => {
    const external = page.locator('#work a[target="_blank"]');
    const count = await external.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(external.nth(i)).toHaveAttribute("rel", /noopener/);
    }
  });
});
