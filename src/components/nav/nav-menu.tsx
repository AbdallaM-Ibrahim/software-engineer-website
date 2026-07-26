"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MENU_IDS } from "@/lib/sections";
import { NavCta } from "./nav-cta";
import { NavItem } from "./nav-item";
import type { NavItem as NavItemData } from "./nav-model";

/**
 * The mobile menu: the full index, because it has vertical room the bar does not.
 *
 * The section list is built from what is actually in the DOM when it opens, so
 * a section that hides itself — Testimonials with no real quotes — never leaves
 * a dead row. Content mounts lazily, so nobody ever sees a pre-filter state, and
 * it stays correct on its own as sections are added or removed.
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
    <Sheet
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
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={openLabel}>
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="end" className="w-64">
        <SheetHeader>
          <SheetTitle>{name}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col px-2">
          <NavCta
            item={cta}
            prominent
            className="mb-2 w-full"
            onClick={close}
          />
          {items.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              variant="panel"
              onClick={close}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
