"use client";

import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DEFAULT_LOCALE, type Locale } from "@/lib/site";

/**
 * Switches between the English and Arabic versions of the current page.
 *
 * A plain <a>, not a router push: English and Arabic are separate route groups
 * with their own root layouts, so the swap is a document navigation either way.
 *
 * hreflang is what tells a search engine the two versions exist. This is for
 * the person who landed on the wrong one.
 */
export function LocaleSwitcher({
  locale,
  label,
  className,
  variant = "icon",
}: {
  locale: Locale;
  /** Name of the *other* language, in that language (e.g. "العربية"). */
  label: string;
  className?: string;
  variant?: "icon" | "text";
}) {
  const pathname = usePathname() ?? "/";
  const target: Locale = locale === "ar" ? "en" : "ar";

  // Strip the current prefix, then apply the other one. Done on the pathname
  // rather than by rebuilding the route so a deep link stays where it is.
  const bare =
    locale === DEFAULT_LOCALE
      ? pathname
      : pathname.replace(/^\/ar(?=\/|$)/, "");
  const normalised = bare === "" ? "/" : bare;
  const href =
    target === DEFAULT_LOCALE
      ? normalised
      : `/ar${normalised === "/" ? "" : normalised}`;

  if (variant === "text") {
    return (
      <a
        href={href}
        hrefLang={target}
        lang={target}
        className={cn(
          "text-muted-foreground hover:text-foreground text-xs font-medium transition-colors",
          className,
        )}
      >
        {label}
      </a>
    );
  }

  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      aria-label={label}
      className={className}
    >
      <a href={href} hrefLang={target} lang={target}>
        <Languages className="size-5" />
        <span className="sr-only">{label}</span>
      </a>
    </Button>
  );
}
