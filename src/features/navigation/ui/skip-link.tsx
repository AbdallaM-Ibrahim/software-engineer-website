/**
 * Lets a keyboard or screen-reader user jump past the header.
 *
 * The site has never had one, which with a fixed header and a menu is the most
 * visible accessibility omission (WCAG 2.4.1). It is the first thing in the
 * body, invisible until focused, and sits above the header's z-50 so it is not
 * covered by the thing it exists to skip.
 *
 * `focus` rather than `focus-visible`: it is only ever reached by Tab, and it
 * must appear every single time it is.
 */
export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="bg-background text-foreground ring-ring/50 sr-only rounded-md border px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-[60] focus:ring-[3px] focus:outline-none"
    >
      {label}
    </a>
  );
}
