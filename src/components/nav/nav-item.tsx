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
    variant === "bar" ? "px-3 py-2" : "hover:bg-accent px-3 py-2.5",
    item.selected
      ? "text-foreground"
      : "text-muted-foreground hover:text-foreground",
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
        {item.label}
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
      {item.label}
    </NavAnchor>
  );
}
