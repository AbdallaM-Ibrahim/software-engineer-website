import type { NavStrings } from "@/lib/i18n";
import { MENU_SECTIONS, ownerOf } from "@/lib/sections";
import { type Locale, localePath, sectionHref } from "@/lib/site";

/**
 * What is in the nav, where each item points, and which one is selected.
 *
 * Every rule lives here and nowhere else, so the bar and the mobile menu cannot
 * disagree — which they previously did, the menu rendering its own copy of a
 * link with no aria-current and different styling. Pure: no React, no DOM, so
 * the fiddly locale-doubled routing rules are testable without a browser.
 */

export type NavItem = {
  key: string;
  label: string;
  /** null renders as text rather than a link — there is nowhere to go. */
  href: string | null;
  ariaCurrent?: "page" | "location" | "true";
  /** Drives the colour and weight treatment. */
  selected: boolean;
};

export type NavContext = {
  nav: NavStrings;
  locale: Locale;
  pathname: string;
  /**
   * Raw scroll-spy result — the section id being read, or null. The bar marks
   * by owner and the menu marks the exact section, so the model takes the id
   * and maps it, rather than the caller pre-resolving one of the two.
   */
  activeSection: string | null;
};

type ServicesState = "hub" | "detail" | "away";

function servicesState(pathname: string, locale: Locale): ServicesState {
  const hub = localePath("/services", locale);
  if (pathname === hub) return "hub";
  if (pathname.startsWith(`${hub}/`)) return "detail";
  return "away";
}

export function isHomePath(pathname: string, locale: Locale): boolean {
  return pathname === localePath("/", locale);
}

/**
 * True while the hero is what's on screen.
 *
 * The hero already carries two large buttons, one of them a contact call to
 * action, so the header's own must stay quiet until they are gone. The hero is
 * the only home-page section left unowned in the registry, which is exactly why
 * a null active section means "still in the hero".
 */
export function heroOwnsCta({
  pathname,
  locale,
  activeSection,
}: Pick<NavContext, "pathname" | "locale" | "activeSection">): boolean {
  return isHomePath(pathname, locale) && activeSection === null;
}

/** The Services item: selected across the whole area, inert on the hub. */
function servicesItem(
  nav: NavStrings,
  locale: Locale,
  state: ServicesState,
): NavItem {
  return {
    key: "services",
    label: nav.services,
    // On the hub there is nowhere to go. Rendering an href would offer a click
    // that navigates to the page you are already on; a bare span also drops out
    // of the tab order rather than being a control that does nothing.
    href: state === "hub" ? null : localePath("/services", locale),
    // "page" is the exact match; "true" is the generic token for an ancestor of
    // the current page, which is what the hub is from a detail page.
    ariaCurrent:
      state === "hub" ? "page" : state === "detail" ? "true" : undefined,
    selected: state !== "away",
  };
}

/** The Contact call to action. */
function ctaItem(
  nav: NavStrings,
  locale: Locale,
  state: ServicesState,
  activeSection: string | null,
): NavItem {
  const marked = activeSection === "contact";
  return {
    key: "contact",
    label: nav.contact,
    // A service page's conversion point is its own WhatsApp and email block, so
    // stay on the page. sectionHref is root-absolute and would navigate away.
    href: state === "detail" ? "#contact" : sectionHref("contact", locale),
    ariaCurrent: marked ? "location" : undefined,
    selected: marked,
  };
}

/** The desktop bar: three links plus the call to action, on every page. */
export function buildBarItems({
  nav,
  locale,
  pathname,
  activeSection,
}: NavContext): { links: NavItem[]; cta: NavItem } {
  const state = servicesState(pathname, locale);
  const owner = activeSection === null ? null : ownerOf(activeSection);

  const section = (id: "about" | "work", label: string): NavItem => ({
    key: id,
    label,
    href: sectionHref(id, locale),
    ariaCurrent: owner === id ? "location" : undefined,
    selected: owner === id,
  });

  return {
    links: [
      section("about", nav.about),
      section("work", nav.work),
      servicesItem(nav, locale, state),
    ],
    cta: ctaItem(nav, locale, state, activeSection),
  };
}

/**
 * The mobile panel: the full index, because a panel has vertical room the bar
 * does not. Sections are filtered against what is actually in the DOM, so a
 * section that hides itself never gets a dead row.
 */
export function buildMenuItems({
  nav,
  locale,
  pathname,
  activeSection,
  present,
}: NavContext & { present: readonly string[] }): NavItem[] {
  const state = servicesState(pathname, locale);
  const items: NavItem[] = [];

  if (isHomePath(pathname, locale)) {
    for (const section of MENU_SECTIONS) {
      if (!present.includes(section.id)) continue;
      // Marked on the exact section, not on its owner: the panel lists them
      // individually, so owner-matching would light up several rows at once.
      const marked = activeSection === section.id;
      items.push({
        key: section.id,
        label: nav[section.menu],
        href: sectionHref(section.id, locale),
        ariaCurrent: marked ? "location" : undefined,
        selected: marked,
      });
    }
  } else {
    items.push({
      key: "home",
      label: nav.home,
      href: localePath("/", locale),
      selected: false,
    });
  }

  items.push(servicesItem(nav, locale, state));
  return items;
}
