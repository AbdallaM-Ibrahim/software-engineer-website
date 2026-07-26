"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MENU_IDS } from "@/lib/sections";
import { NavCta } from "./nav-cta";
import { NavItem } from "./nav-item";
import type { NavItem as NavItemData } from "./nav-model";

/**
 * The mobile menu: a panel anchored under the header, sized to its contents.
 *
 * It used to be a modal full-height sheet, which off the home page held three
 * links and still covered the entire viewport. Now the height is auto and only
 * capped — at the viewport's width, which keeps it dropdown-shaped, and at the
 * space actually below the header, which is the shorter of the two in landscape
 * and on tablets. A scrollbar appears only if that cap is reached.
 *
 * A popover rather than a dialog: this is a list of links, so it should not be
 * modal, lock page scroll, or trap focus. Radix still gives Escape, outside
 * dismissal, focus return and the aria-expanded wiring.
 *
 * The section list is built from what is in the DOM when it opens, so a section
 * that hides itself — Testimonials with no real quotes — never leaves a dead
 * row. Content mounts lazily, so nobody sees a pre-filter state, and it stays
 * correct on its own as sections come and go.
 */
export function NavMenu({
  name,
  openLabel,
  cta,
  buildItems,
}: {
  name: string;
  openLabel: string;
  cta: NavItemData;
  buildItems: (present: string[]) => NavItemData[];
}) {
  const [open, setOpen] = React.useState(false);
  const [present, setPresent] = React.useState<string[]>([]);

  const items = buildItems(present);
  const close = () => setOpen(false);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        // Both updates land in the same batch, so the content mounts with the
        // list already filtered.
        if (next) {
          setPresent(MENU_IDS.filter((id) => document.getElementById(id)));
        }
        setOpen(next);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={openLabel}>
          <Menu className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        aria-label={name}
        className="scroll-slim flex max-h-[min(100vw,calc(100dvh-4.5rem))] w-[min(18rem,calc(100vw-2rem))] flex-col overflow-y-auto p-2"
      >
        <NavCta item={cta} prominent className="w-full" onClick={close} />
        <hr className="border-foreground/10 my-2" />
        {items.map((item, index) => (
          <React.Fragment key={item.key}>
            {/* One hairline between jumping within this page and leaving it —
                the site's separator device, and the only grouping the panel
                needs. */}
            {index > 0 &&
            item.kind === "route" &&
            items[index - 1]?.kind === "section" ? (
              <hr className="border-foreground/10 my-2" />
            ) : null}
            <NavItem item={item} variant="panel" onClick={close} />
          </React.Fragment>
        ))}
      </PopoverContent>
    </Popover>
  );
}
