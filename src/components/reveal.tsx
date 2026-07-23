"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type RevealTag = "div" | "section" | "li" | "article";

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: RevealTag;
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fail-safe: reveal immediately when motion is reduced or IntersectionObserver
    // is unavailable, so content is never left hidden.
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      // Deferred a frame rather than set synchronously here: a setState in the
      // effect body triggers a cascading render (react-hooks/set-state-in-effect).
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = as as React.ElementType;

  return (
    <Comp
      ref={ref}
      // Hook for the no-JS fallback in the frontend layout: without scripts the
      // IntersectionObserver never runs, so everything below the fold would stay
      // at opacity-0 forever.
      data-reveal={shown ? "shown" : "hidden"}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
        className,
      )}
      style={{ transitionDelay: shown ? `${delay}s` : "0s" }}
    >
      {children}
    </Comp>
  );
}
