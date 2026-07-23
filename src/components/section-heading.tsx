import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

/**
 * Left-aligned section header.
 *
 * The mono label carries a real count ("3 case studies", "2 roles") rather than a
 * decorative index — the number tells the reader how much is ahead of them. The
 * rule above it is what separates sections, so the page no longer relies on
 * alternating background bands that all but vanish in dark mode.
 */
export function SectionHeading({
  eyebrow,
  count,
  title,
  description,
  className,
}: {
  eyebrow: string;
  count?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    // The rule spans the full container so it reads as the section divider it
    // is; only the text is measure-constrained.
    <Reveal className={cn("border-foreground/15 border-t pt-4", className)}>
      <p className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
        <span className="text-foreground">{eyebrow}</span>
        {count ? <span className="mx-2 opacity-40">/</span> : null}
        {count}
      </p>
      <h2 className="font-display mt-4 max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground mt-3 max-w-2xl text-base text-pretty">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
