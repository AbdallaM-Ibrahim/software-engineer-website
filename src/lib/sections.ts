import type { NavStrings } from "@/lib/i18n";

/**
 * The home page's sections, and which nav link each one marks.
 *
 * This is the single source of truth. The nav used to keep its own list of
 * section ids, which drifted out of sync with what the page actually rendered —
 * Education and Availability were never tracked, so the active mark blanked out
 * entirely while the reader was in them. Adding a section is now one line here,
 * and both the scroll-spy and the mobile menu pick it up.
 *
 * The grouping is load-bearing, not cosmetic. The scroll-spy only works if each
 * owner's sections form a *contiguous run* in render order: if a run were
 * interrupted, the mark would jump backwards as the reader scrolled. A flat
 * `{ id, owner }[]` list can express that broken state and would need a test to
 * catch it. This shape cannot — an owner appears once and owns a run — so the
 * illegal state is unrepresentable rather than merely asserted.
 *
 * Array order is the home page's render order. Keep them in step.
 */

/** The bar links that can be marked by scrolling. Services is a route, not a
    section, so it is not an owner. */
export type NavOwner = "about" | "work" | "contact";

type SectionEntry = {
  /** The DOM id on the rendered <section>. */
  id: string;
  /** Key into the nav dictionary for the mobile menu, or null to leave the
      section out of the menu while still tracking it for the active mark. */
  menu: keyof NavStrings | null;
};

type NavGroup = {
  owner: NavOwner | null;
  sections: readonly SectionEntry[];
};

export const NAV_GROUPS = [
  // The hero is deliberately unowned. At the top of the page nothing is being
  // read yet, so nothing should be marked — and that null is also what keeps the
  // header's call to action quiet while the hero's own buttons are on screen.
  {
    owner: null,
    sections: [{ id: "top", menu: null }],
  },
  {
    owner: "about",
    sections: [
      { id: "about", menu: "about" },
      { id: "skills", menu: "skills" },
      { id: "experience", menu: "experience" },
      { id: "education", menu: "education" },
      // A short strip rather than a destination: tracked so the mark holds while
      // it is on screen, but not worth a row in the menu.
      { id: "availability", menu: null },
    ],
  },
  {
    owner: "work",
    sections: [
      { id: "work", menu: "work" },
      { id: "testimonials", menu: "testimonials" },
    ],
  },
  {
    owner: "contact",
    sections: [{ id: "contact", menu: "contact" }],
  },
] as const satisfies readonly NavGroup[];

export type SectionId = (typeof NAV_GROUPS)[number]["sections"][number]["id"];

/** Every section id, in render order. */
export const SECTION_ORDER: readonly SectionId[] = NAV_GROUPS.flatMap((group) =>
  group.sections.map((section) => section.id),
);

/** The ids the scroll-spy observes — everything that marks a link. */
export const SPY_IDS: readonly SectionId[] = NAV_GROUPS.flatMap((group) =>
  group.owner === null ? [] : group.sections.map((section) => section.id),
);

/** Sections that earn a row in the mobile menu, paired with their label key. */
export const MENU_SECTIONS: readonly {
  id: SectionId;
  menu: keyof NavStrings;
}[] = NAV_GROUPS.flatMap((group) =>
  group.sections.flatMap((section) =>
    section.menu === null ? [] : [{ id: section.id, menu: section.menu }],
  ),
);

export const MENU_IDS: readonly SectionId[] = MENU_SECTIONS.map(
  (section) => section.id,
);

const OWNER_BY_ID: ReadonlyMap<string, NavOwner> = new Map(
  NAV_GROUPS.flatMap((group) =>
    group.owner === null
      ? []
      : group.sections.map(
          (section) => [section.id, group.owner] as [string, NavOwner],
        ),
  ),
);

/** Which nav link a section marks, or null if it marks nothing. */
export function ownerOf(id: string): NavOwner | null {
  return OWNER_BY_ID.get(id) ?? null;
}
