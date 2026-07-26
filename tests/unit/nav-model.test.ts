import { describe, expect, test } from "vitest";

import {
  buildBarItems,
  buildMenuItems,
  heroOwnsCta,
} from "@/components/nav/nav-model";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/site";

// Real dictionaries rather than a fixture, so a renamed key fails here too.
const en = getDictionary("en").nav;
const ar = getDictionary("ar").nav;

function bar(
  pathname: string,
  activeSection: string | null = null,
  locale: Locale = "en",
) {
  const { links, cta } = buildBarItems({
    nav: locale === "ar" ? ar : en,
    locale,
    pathname,
    activeSection,
  });
  const find = (key: string) => {
    const item = links.find((link) => link.key === key);
    if (!item) throw new Error(`no bar item "${key}"`);
    return item;
  };
  return { links, cta, find };
}

describe("Services", () => {
  test("is an ordinary link away from the services area", () => {
    const services = bar("/").find("services");
    expect(services.href).toBe("/services");
    expect(services.selected).toBe(false);
    expect(services.ariaCurrent).toBeUndefined();
  });

  test("is selected and inert on the hub", () => {
    const services = bar("/services").find("services");
    // No href: a click would navigate to the page you are already on, and a
    // bare span keeps it out of the tab order.
    expect(services.href).toBeNull();
    expect(services.selected).toBe(true);
    expect(services.ariaCurrent).toBe("page");
  });

  test("is selected but still links up to the hub from a detail page", () => {
    const services = bar("/services/payments").find("services");
    expect(services.href).toBe("/services");
    expect(services.selected).toBe(true);
    // "true" is the generic ancestor token; "page" is reserved for the exact match.
    expect(services.ariaCurrent).toBe("true");
  });

  test.each([
    ["/ar", "/ar/services", false, undefined],
    ["/ar/services", null, true, "page"],
    ["/ar/services/payments", "/ar/services", true, "true"],
  ])("on %s", (pathname, href, selected, ariaCurrent) => {
    const services = bar(pathname, null, "ar").find("services");
    expect(services.href).toBe(href);
    expect(services.selected).toBe(selected);
    expect(services.ariaCurrent).toBe(ariaCurrent);
  });

  test("a slug that merely starts with the hub path is not the services area", () => {
    expect(bar("/services-and-rates").find("services").selected).toBe(false);
  });
});

describe("the call to action", () => {
  test("points at the home form from the home page", () => {
    expect(bar("/").cta.href).toBe("/#contact");
    expect(bar("/ar", null, "ar").cta.href).toBe("/ar/#contact");
  });

  test("stays on the page from a service detail page", () => {
    // The page's own WhatsApp and email block is the conversion point there;
    // sectionHref is root-absolute and would navigate away mid-consideration.
    expect(bar("/services/payments").cta.href).toBe("#contact");
    expect(bar("/ar/services/payments", null, "ar").cta.href).toBe("#contact");
  });

  test("leaves for the home form from the hub, which has no block of its own", () => {
    expect(bar("/services").cta.href).toBe("/#contact");
  });

  test("is marked once the reader reaches contact", () => {
    expect(bar("/", "contact").cta.selected).toBe(true);
    expect(bar("/", "contact").cta.ariaCurrent).toBe("location");
    expect(bar("/", "work").cta.selected).toBe(false);
  });
});

describe("section marking in the bar", () => {
  test.each([
    ["about", "about"],
    ["skills", "about"],
    ["experience", "about"],
    // The sections that used to blank the mark out entirely.
    ["education", "about"],
    ["availability", "about"],
    ["work", "work"],
    ["testimonials", "work"],
  ])("reading %s marks %s", (activeSection, key) => {
    const { links } = bar("/", activeSection);
    const marked = links.filter((link) => link.selected);
    expect(marked.map((link) => link.key)).toEqual([key]);
  });

  test("nothing is marked in the hero", () => {
    expect(bar("/", null).links.every((link) => !link.selected)).toBe(true);
  });

  test("sections announce location, never page", () => {
    const about = bar("/", "skills").find("about");
    expect(about.ariaCurrent).toBe("location");
  });

  test("no section is marked away from the home page", () => {
    // The spy is disabled off the home page, so activeSection is null there.
    const { find } = bar("/services/payments", null);
    expect(find("about").selected).toBe(false);
    expect(find("work").selected).toBe(false);
  });
});

describe("heroOwnsCta", () => {
  test("is true only while the hero is on screen", () => {
    expect(
      heroOwnsCta({ pathname: "/", locale: "en", activeSection: null }),
    ).toBe(true);
    expect(
      heroOwnsCta({ pathname: "/", locale: "en", activeSection: "about" }),
    ).toBe(false);
    expect(
      heroOwnsCta({ pathname: "/ar", locale: "ar", activeSection: null }),
    ).toBe(true);
  });

  test("is false off the home page, where no hero competes with it", () => {
    expect(
      heroOwnsCta({ pathname: "/services", locale: "en", activeSection: null }),
    ).toBe(false);
  });
});

describe("the mobile panel", () => {
  const present = [
    "about",
    "skills",
    "experience",
    "education",
    "work",
    "testimonials",
    "contact",
  ];

  function menu(
    pathname: string,
    ids = present,
    activeSection: string | null = null,
  ) {
    return buildMenuItems({
      nav: en,
      locale: "en",
      pathname,
      activeSection,
      present: ids,
    });
  }

  test("lists the full index on the home page, then Services", () => {
    expect(menu("/").map((item) => item.key)).toEqual([...present, "services"]);
  });

  test("drops sections that are not in the DOM", () => {
    // Testimonials hides itself when every quote is a placeholder.
    const keys = menu(
      "/",
      present.filter((id) => id !== "testimonials"),
    ).map((item) => item.key);
    expect(keys).not.toContain("testimonials");
    expect(keys).toContain("work");
  });

  test("becomes route navigation off the home page", () => {
    expect(menu("/services/payments").map((item) => item.key)).toEqual([
      "home",
      "services",
    ]);
  });

  test("marks the exact section, not every section its owner covers", () => {
    const marked = menu("/", present, "skills").filter((item) => item.selected);
    expect(marked.map((item) => item.key)).toEqual(["skills"]);
  });

  test("carries the same Services treatment as the bar", () => {
    const services = menu("/services").find((item) => item.key === "services");
    expect(services?.href).toBeNull();
    expect(services?.ariaCurrent).toBe("page");
  });
});
