import { Quote } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { initials } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import type { Testimonial } from "@/payload-types";

export function Testimonials({
  items,
  dict,
}: {
  items: Testimonial[];
  dict: Dictionary;
}) {
  // Placeholder quotes are never rendered. Fabricated social proof labelled
  // "placeholder" reads as an unfinished site and costs more trust than an
  // absent section, so this stays hidden until real testimonials exist.
  const real = items.filter((t) => !t.isPlaceholder);
  if (real.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={dict.testimonials.eyebrow}
          count={dict.testimonials.count(real.length)}
          title={dict.testimonials.title}
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {real.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06}>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-4">
                  <Quote className="text-primary/30 size-8" />
                  <p className="flex-1 text-sm leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/10 text-primary grid size-10 place-items-center rounded-full font-mono text-sm font-semibold">
                      {initials(t.author)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-display truncate text-sm font-semibold">
                        {t.author}
                      </p>
                      <p className="text-muted-foreground truncate font-mono text-xs">
                        {[t.role, t.company].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
