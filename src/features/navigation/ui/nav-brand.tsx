"use client";

import { NavAnchor } from "./nav-anchor";

/**
 * The wordmark: monogram plus the full name, which folds away on small screens.
 *
 * The monogram is outlined rather than filled. It was the one non-interactive
 * teal mark on the site, which contradicts the palette's own rule in
 * globals.css — the accent is spent on interactive elements and metric marks,
 * nothing else. Freeing it means teal reads unambiguously as "interactive",
 * which is what the nav's selected state now depends on.
 *
 * Set in the display face, like every heading on the site; it previously used
 * the body face and belonged to nothing.
 */
export function NavBrand({
  name,
  href,
  label,
}: {
  name: string;
  href: string;
  /** Overrides the accessible name — on the home page this is "back to top",
      since that is what it does there. */
  label?: string;
}) {
  return (
    <NavAnchor
      href={href}
      aria-label={label ?? name}
      className="focus-visible:ring-ring/50 flex items-center gap-2 rounded-md outline-none focus-visible:ring-[3px]"
    >
      <span className="border-foreground/25 text-foreground font-display grid size-8 place-items-center rounded-md border text-sm font-semibold">
        AM
      </span>
      <span className="font-display hidden font-semibold tracking-tight sm:inline">
        {name}
      </span>
    </NavAnchor>
  );
}
