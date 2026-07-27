"use client";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { NavAnchor } from "./nav-anchor";
import type { NavItem as NavItemData } from "../model";

/**
 * The Contact call to action.
 *
 * Quiet while the hero is on screen, filled once the reader is into a section.
 * The hero already carries two large buttons, one of them a contact call to
 * action, so a filled button here at page top would be the third on screen and
 * a duplicate of the second.
 *
 * Ghost rather than outline for the quiet state: an outlined button would
 * mirror the hero's own outlined "Get in touch" and read as the same control
 * twice. Ghost lets it recede into the link row and then become a button — the
 * change itself is the emphasis.
 *
 * Both variants share the size's padding, so the swap changes no geometry.
 */
export function NavCta({
  item,
  prominent,
  className,
  onClick,
}: {
  item: NavItemData;
  prominent: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      asChild
      size="sm"
      variant={prominent ? "default" : "ghost"}
      className={cn(
        "transition-colors duration-300 motion-reduce:transition-none",
        className,
      )}
    >
      {/* The model always gives the call to action somewhere to go. */}
      <NavAnchor
        href={item.href ?? "#contact"}
        aria-current={item.ariaCurrent}
        onClick={onClick}
      >
        {item.label}
      </NavAnchor>
    </Button>
  );
}
