import { ExternalLink } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { dateRange, toLines } from "@/lib/format";
import type { Experience as ExperienceType } from "@/payload-types";

export function Experience({ items }: { items: ExperienceType[] }) {
  return (
    <section
      id="experience"
      className="scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Experience"
          count={`${items.length} ${items.length === 1 ? "role" : "roles"}`}
          title="Where I've worked"
        />

        <div className="mt-10 max-w-4xl space-y-8 border-l pl-6 sm:pl-8">
          {items.map((job, i) => {
            const bullets = toLines(job.description);
            return (
              <Reveal
                as="article"
                key={job.id}
                delay={i * 0.05}
                className="relative"
              >
                <span className="bg-primary ring-background absolute top-1.5 -left-[31px] size-3 rounded-full ring-4 sm:-left-[39px]" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-lg font-semibold">
                    {job.title}
                  </h3>
                  <span className="text-muted-foreground font-mono text-xs">
                    {dateRange(job.from, job.to, job.isPresent ?? false)}
                  </span>
                </div>
                <div className="text-primary mt-0.5 flex items-center gap-1.5 text-sm font-medium">
                  {job.website ? (
                    <a
                      href={job.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:underline"
                    >
                      {job.company}
                      <ExternalLink className="size-3.5" />
                    </a>
                  ) : (
                    <span>{job.company}</span>
                  )}
                </div>
                {bullets.length > 0 ? (
                  <ul className="text-muted-foreground mt-3 space-y-1.5 text-sm">
                    {bullets.map((line, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="bg-muted-foreground/50 mt-2 size-1 shrink-0 rounded-full" />
                        <span className="leading-relaxed">{line}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
