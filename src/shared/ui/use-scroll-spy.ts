"use client";

import * as React from "react";

/**
 * Which of the given sections the reader is currently looking at.
 *
 * One IntersectionObserver across every section rather than a scroll handler
 * measuring each one — the browser does the work off the main thread, so this
 * costs nothing per frame.
 *
 * Two consumers: the nav, which passes the section registry's SPY_IDS, and the
 * service page's table of contents, which passes heading ids. Extracted so the
 * observer's tuning below lives in one place instead of being copy-pasted and
 * drifting.
 */
export function useScrollSpy({
  ids,
  enabled = true,
}: {
  ids: readonly string[];
  /** Set false where there is nothing to track, e.g. off the home page. */
  enabled?: boolean;
}): string | null {
  const [active, setActive] = React.useState<string | null>(null);

  // Callers build their id lists inline, so a new array arrives every render.
  // Keying the effect on the contents rather than the identity keeps it from
  // tearing down and rebuilding the observer on every parent render.
  const key = ids.join(",");

  React.useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }

    const elements = key
      .split(",")
      .filter((id) => id.length > 0)
      .map((id) => document.getElementById(id))
      // Sections that hide themselves — Testimonials with no real quotes — are
      // simply absent from the DOM, so this is also the "is it on the page" check.
      .filter((element): element is HTMLElement => element !== null);
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
  }, [enabled, key]);

  return active;
}
