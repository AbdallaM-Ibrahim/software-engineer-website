"use client";

import { NavAnchor } from "./nav-anchor";

/** The wordmark: monogram plus the full name, which folds away on small screens. */
export function NavBrand({ name, href }: { name: string; href: string }) {
  return (
    <NavAnchor href={href} className="flex items-center gap-2 font-bold">
      <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-md text-sm">
        AM
      </span>
      <span className="hidden sm:inline">{name}</span>
    </NavAnchor>
  );
}
