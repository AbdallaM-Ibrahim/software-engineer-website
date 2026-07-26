"use client";

import { usePathname } from "next/navigation";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { useScrolled } from "@/hooks/use-scrolled";
import type { NavStrings } from "@/lib/i18n";
import { SPY_IDS } from "@/lib/sections";
import { type Locale, localePath } from "@/lib/site";
import { cn } from "@/lib/utils";
import { NavBrand } from "./nav-brand";
import { NavCta } from "./nav-cta";
import { NavItem } from "./nav-item";
import { NavMenu } from "./nav-menu";
import {
  buildBarItems,
  buildMenuItems,
  heroOwnsCta,
  isHomePath,
} from "./nav-model";

/**
 * The site header.
 *
 * Composition only — the rules live in ./nav-model, the section list in
 * @/lib/sections, and the scroll behaviour in the two hooks. The bar carries
 * three links and a call to action; the full index lives in the mobile panel,
 * which has vertical room the bar does not.
 */
export function Navbar({
  name,
  nav,
  switchLabel,
  locale,
}: {
  name: string;
  // Only the nav strings, not the whole Dictionary — the dictionary carries
  // `count`/`copyright` functions, which cannot be serialized into a client
  // component.
  nav: NavStrings;
  /** The other language's name, for the switcher. */
  switchLabel: string;
  locale: Locale;
}) {
  const pathname = usePathname() ?? "/";
  const scrolled = useScrolled();
  const onHome = isHomePath(pathname, locale);
  const activeSection = useScrollSpy({ ids: SPY_IDS, enabled: onHome });

  const context = { nav, locale, pathname, activeSection };
  const { links, cta } = buildBarItems(context);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "bg-background/80 border-b backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <nav
        aria-label={nav.primary}
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <NavBrand name={name} href={localePath("/", locale)} />

        <div className="hidden items-center gap-1 md:flex">
          {links.map((item) => (
            <NavItem key={item.key} item={item} />
          ))}
          <NavCta
            item={cta}
            prominent={!heroOwnsCta(context)}
            className="ms-2"
          />
          <LocaleSwitcher locale={locale} label={switchLabel} />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <LocaleSwitcher locale={locale} label={switchLabel} />
          <ThemeToggle />
          <NavMenu
            name={name}
            openLabel={nav.openMenu}
            cta={cta}
            buildItems={(present) => buildMenuItems({ ...context, present })}
          />
        </div>
      </nav>
    </header>
  );
}
