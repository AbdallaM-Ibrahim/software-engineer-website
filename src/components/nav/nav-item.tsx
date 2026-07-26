"use client";

import { cn } from "@/lib/utils";
import { NavAnchor } from "./nav-anchor";
import type { NavItem as NavItemData } from "./nav-model";

/**
 * One nav item, used by both the bar and the mobile panel.
 *
 * Shared deliberately: the two previously rendered their own copies of a link,
 * which is why the mobile one carried no aria-current and did not match the
 * bar's styling. One component means they cannot drift again.
 */
export function NavItem({
  item,
  variant = "bar",
  onClick,
}: {
  item: NavItemData;
  variant?: "bar" | "panel";
  /** The panel passes its dismiss here rather than wrapping this in a Radix
      Close: `asChild` clones props onto its child, and a function component
      would silently swallow them. */
  onClick?: () => void;
}) {
  const classes = cn(
    "rounded-md text-sm font-medium transition-colors",
    // The site's focus convention, from ui/button.tsx. The nav links carried
    // none, so keyboard users fell back to the browser default outline over a
    // header that is transparent on top of the hero.
    "focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]",
    variant === "bar" ? "px-3 py-2" : "hover:bg-accent px-3 py-2.5",
    // Teal is what globals.css reserves for interactive state, and the previous
    // muted-to-foreground shift was close to invisible.
    item.selected
      ? "text-primary"
      : "text-muted-foreground hover:text-foreground",
  );

  // Bold is wider than medium, so switching weight would reflow the whole row.
  // A hidden bold copy stacked in the same grid cell holds the width open, and
  // aria-hidden keeps it out of the accessible name.
  const label = (
    <span
      className={cn(
        "grid",
        variant === "bar" ? "justify-items-center" : "justify-items-start",
      )}
    >
      <span
        aria-hidden
        className="invisible col-start-1 row-start-1 font-semibold"
      >
        {item.label}
      </span>
      <span
        className={cn(
          "col-start-1 row-start-1",
          item.selected && "font-semibold",
        )}
      >
        {item.label}
      </span>
    </span>
  );

  // No href means this is the page you are already on. Rendering a link would
  // offer a click that navigates nowhere; a span also drops out of the tab
  // order rather than being a control that does nothing.
  //
  // Deliberately no onClick either — it is not a control, so it does not get to
  // dismiss the panel. Attaching one would make it a fake button that a
  // keyboard user cannot reach.
  if (item.href === null) {
    return (
      <span aria-current={item.ariaCurrent} className={classes}>
        {label}
      </span>
    );
  }

  return (
    <NavAnchor
      href={item.href}
      aria-current={item.ariaCurrent}
      className={classes}
      onClick={onClick}
    >
      {label}
    </NavAnchor>
  );
}
