import { cn } from "@/lib/utils";

export type Metric = {
  before?: string | null;
  value: string;
  direction?: "up" | "down" | null;
  label?: string | null;
  source?: string | null;
};

/**
 * The page's signature element: the three outcomes these projects are actually
 * remembered by, set in tabular mono so the figures line up as a row of readings.
 *
 * These are the most persuasive thing on the site, so they sit in the hero rather
 * than three scrolls down inside a dialog.
 */
export function MetricStrip({
  metrics,
  className,
}: {
  metrics: Metric[];
  className?: string;
}) {
  if (metrics.length === 0) return null;

  return (
    <dl
      className={cn(
        "border-foreground/15 grid border-t md:grid-cols-3",
        className,
      )}
    >
      {metrics.map((m, i) => (
        // Three across only from md, and the large figure size only from lg: a
        // "200 → 13,000" reading at 2.5rem does not fit a third of a 640–1023px
        // viewport and the columns collide.
        <div
          key={`${m.value}-${i}`}
          className={cn(
            "border-foreground/10 flex min-w-0 flex-col-reverse gap-1 border-b py-5 md:border-b-0 md:py-6",
            i > 0 && "md:border-s md:ps-6",
            i < metrics.length - 1 && "md:pe-6",
          )}
        >
          {/* Reversed visually so the figure leads while the label stays the
              <dt> the figure belongs to. */}
          <dt className="text-muted-foreground font-mono text-xs tracking-wide">
            {m.label}
            {m.source ? (
              <span className="block opacity-60">{m.source}</span>
            ) : null}
          </dt>
          <dd className="font-mono text-3xl leading-none font-semibold lg:text-[2.5rem]">
            {m.before ? (
              <>
                <span className="text-muted-foreground">{m.before}</span>
                <span className="text-primary mx-1.5" aria-hidden="true">
                  →
                </span>
                <span className="sr-only">increased to</span>
              </>
            ) : null}
            {m.value}
            {!m.before && m.direction ? (
              <>
                <span className="text-primary ml-1.5" aria-hidden="true">
                  {m.direction === "up" ? "↑" : "↓"}
                </span>
                <span className="sr-only">
                  {m.direction === "up" ? "increase" : "reduction"}
                </span>
              </>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
