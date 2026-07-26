"use client";

import * as React from "react";

/**
 * True once the page has scrolled past `threshold` pixels.
 *
 * Drives the header's background: transparent over the very top of the page,
 * opaque and ruled once anything has scrolled under it. Kept apart from
 * useScrollSpy because they answer different questions — this one is about the
 * header's own appearance, that one is about where the reader is.
 */
export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    // Run once on mount: a reload partway down the page starts scrolled.
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
