"use client";

import { useScrollSpy } from "@/hooks/use-scroll-spy";
import type { Heading } from "@/lib/headings";
import { cn } from "@/lib/utils";

/**
 * Below this, a sticky rail is more furniture than help, so the contents stay
 * a disclosure at every width.
 */
const RAIL_MIN_HEADINGS = 3;

export function hasToc(headings: Heading[]): boolean {
  return headings.length > 0;
}

export function hasRail(headings: Heading[]): boolean {
  return headings.length >= RAIL_MIN_HEADINGS;
}

/**
 * In-page contents for a service page.
 *
 * A sticky rail in the start margin on large screens, and a native disclosure
 * below that — or at every width when there is little to list. The disclosure
 * is a plain details element: no dependency, and it works with scripts
 * disabled, which matters because the links are the page's real structure.
 *
 * Rendered as two variants rather than one component that moves, because the
 * rail lives in a grid column beside the article and the disclosure lives
 * inside it.
 */
export function ServiceToc({
  headings,
  label,
  variant,
}: {
  headings: Heading[];
  label: string;
  variant: "rail" | "disclosure";
}) {
  const active = useScrollSpy({ ids: headings.map((heading) => heading.id) });

  if (headings.length === 0) return null;
  if (variant === "rail" && !hasRail(headings)) return null;

  const list = (
    <ul className="border-foreground/10 space-y-1 border-s ps-4">
      {headings.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            aria-current={active === heading.id ? "location" : undefined}
            className={cn(
              "focus-visible:ring-ring/50 block rounded-md py-1 text-sm text-pretty transition-colors outline-none focus-visible:ring-[3px]",
              active === heading.id
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );

  // The site's eyebrow voice, the same treatment every other label gets.
  const eyebrow =
    "text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase";

  if (variant === "disclosure") {
    return (
      <details
        className={cn("my-10", hasRail(headings) && "lg:hidden")}
        // Open by default when it is the only form, since then it is the
        // page's structure rather than an aside.
        open={!hasRail(headings)}
      >
        <summary
          className={cn(
            eyebrow,
            "hover:text-foreground focus-visible:ring-ring/50 cursor-pointer rounded-md outline-none focus-visible:ring-[3px]",
          )}
        >
          {label}
        </summary>
        <div className="mt-3">{list}</div>
      </details>
    );
  }

  return (
    <nav
      aria-label={label}
      className="scroll-slim sticky top-24 hidden max-h-[calc(100dvh-8rem)] overflow-y-auto lg:block"
    >
      <p className={eyebrow}>{label}</p>
      <div className="mt-3">{list}</div>
    </nav>
  );
}
