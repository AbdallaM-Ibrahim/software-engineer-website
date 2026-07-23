"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import type { NavStrings } from "@/lib/i18n";
import { type Locale, localePath, sectionHref } from "@/lib/site";

type NavLink = { href: string; label: string; section?: string };

export function Navbar({
  name,
  nav,
  switchLabel,
  locale,
  hasTestimonials = false,
}: {
  name: string;
  // Only the nav strings, not the whole Dictionary — the dictionary carries
  // `count`/`copyright` functions, which cannot be serialized into a client
  // component.
  nav: NavStrings;
  /** The other language's name, for the switcher. */
  switchLabel: string;
  locale: Locale;
  /** The testimonials section hides itself when there are no real quotes, so
      its anchor is only advertised when the section is actually on the page. */
  hasTestimonials?: boolean;
}) {
  const pathname = usePathname();
  const home = localePath("/", locale);
  const onHome = pathname === home;

  const [scrolled, setScrolled] = React.useState(false);
  const [active, setActive] = React.useState<string | null>(null);

  const sections = React.useMemo(() => {
    const ids = ["about", "skills", "experience", "work"];
    if (hasTestimonials) ids.push("testimonials");
    ids.push("contact");
    return ids;
  }, [hasTestimonials]);

  const links: NavLink[] = onHome
    ? [
        {
          href: sectionHref("about", locale),
          label: nav.about,
          section: "about",
        },
        {
          href: sectionHref("skills", locale),
          label: nav.skills,
          section: "skills",
        },
        {
          href: sectionHref("experience", locale),
          label: nav.experience,
          section: "experience",
        },
        { href: localePath("/services", locale), label: nav.services },
        {
          href: sectionHref("work", locale),
          label: nav.work,
          section: "work",
        },
        ...(hasTestimonials
          ? [
              {
                href: sectionHref("testimonials", locale),
                label: nav.testimonials,
                section: "testimonials",
              },
            ]
          : []),
        {
          href: sectionHref("contact", locale),
          label: nav.contact,
          section: "contact",
        },
      ]
    : // Off the home page there are no sections to jump to, so the nav becomes
      // ordinary page navigation instead of a broken list of fragments.
      [
        { href: home, label: nav.home },
        { href: localePath("/services", locale), label: nav.services },
        { href: sectionHref("contact", locale), label: nav.contact },
      ];

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy. One IntersectionObserver across all sections rather than a
  // scroll handler measuring each one — the browser does the work off the main
  // thread, so this costs nothing per frame.
  React.useEffect(() => {
    if (!onHome) {
      setActive(null);
      return;
    }

    const elements = sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }
        // Whichever tracked section currently occupies the most of the viewport
        // wins, so a short section scrolling past a tall one doesn't steal it.
        const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        setActive(best ? best[0] : null);
      },
      {
        // Ignores the fixed header at the top and the tail of the viewport, so
        // "active" means "the section you are reading".
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [onHome, sections]);

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
        aria-label={nav.home}
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <a href={home} className="flex items-center gap-2 font-bold">
          <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-md text-sm">
            AM
          </span>
          <span className="hidden sm:inline">{name}</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={
                link.section && link.section === active ? "true" : undefined
              }
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                link.section && link.section === active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </a>
          ))}
          <LocaleSwitcher locale={locale} label={switchLabel} />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <LocaleSwitcher locale={locale} label={switchLabel} />
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={nav.openMenu}>
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="end" className="w-64">
              <SheetHeader>
                <SheetTitle>{name}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col px-2">
                {links.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a
                      href={link.href}
                      className="hover:bg-accent rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
