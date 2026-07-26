import { describe, expect, test } from "vitest";

import {
  MENU_IDS,
  MENU_SECTIONS,
  NAV_GROUPS,
  SECTION_ORDER,
  SPY_IDS,
  ownerOf,
} from "@/lib/sections";

// Contiguous ownership needs no test: NAV_GROUPS cannot express a broken run,
// and an invalid `menu` key is a tsc error. What is left are the properties the
// shape does not guarantee on its own.

describe("registry invariants", () => {
  test("each owner appears at most once", () => {
    // Two groups sharing an owner would split its run in two, which is exactly
    // the backwards-jumping mark the grouping exists to prevent.
    const owners = NAV_GROUPS.map((group) => group.owner).filter(
      (owner) => owner !== null,
    );
    expect(new Set(owners).size).toBe(owners.length);
  });

  test("no section id is declared twice", () => {
    expect(new Set(SECTION_ORDER).size).toBe(SECTION_ORDER.length);
  });

  test("no two sections claim the same menu label", () => {
    const labels = MENU_SECTIONS.map((section) => section.menu);
    expect(new Set(labels).size).toBe(labels.length);
  });
});

describe("ownerOf", () => {
  test("the hero is unowned, so nothing is marked at the top of the page", () => {
    expect(ownerOf("top")).toBeNull();
  });

  test("unknown ids are unowned rather than throwing", () => {
    expect(ownerOf("does-not-exist")).toBeNull();
  });

  test.each([
    ["about", "about"],
    ["skills", "about"],
    ["experience", "about"],
    // The regression: these two sit between Experience and Work on the home
    // page and used to be tracked by nothing, so the mark blanked out mid-scroll.
    ["education", "about"],
    ["availability", "about"],
    ["work", "work"],
    ["testimonials", "work"],
    ["contact", "contact"],
  ])("%s marks %s", (id, owner) => {
    expect(ownerOf(id)).toBe(owner);
  });
});

describe("derivations", () => {
  test("every rendered section except the hero is observed", () => {
    expect(SPY_IDS).toEqual(SECTION_ORDER.filter((id) => id !== "top"));
  });

  test("the menu lists destinations, not the hero or the availability strip", () => {
    expect(MENU_IDS).toEqual([
      "about",
      "skills",
      "experience",
      "education",
      "work",
      "testimonials",
      "contact",
    ]);
  });

  test("owned sections form contiguous runs in render order", () => {
    // Structurally guaranteed by NAV_GROUPS, but assert it against the flattened
    // output too — this is what actually reaches the scroll-spy, and it is the
    // property a future refactor back to a flat list would silently break.
    const seen = new Set<string>();
    let previous: string | null = null;

    for (const id of SPY_IDS) {
      const owner = ownerOf(id);
      expect(owner).not.toBeNull();
      if (owner !== previous) {
        expect(seen.has(owner as string)).toBe(false);
        seen.add(owner as string);
        previous = owner;
      }
    }
  });
});
