import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { dateRange } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import type { Education as EducationType } from "@/payload-types";

export function Education({
  items,
  dict,
  locale,
}: {
  items: EducationType[];
  dict: Dictionary;
  locale: Locale;
}) {
  if (items.length === 0) return null;

  return (
    <section
      id="education"
      className="scroll-mt-20 px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={dict.education.eyebrow}
          count={dict.education.count(items.length)}
          title={dict.education.title}
        />

        {/* One entry: a compact row, not a card floating in a full-height band. */}
        <dl className="mt-8 max-w-4xl divide-y border-t">
          {items.map((edu, i) => (
            <Reveal as="div" key={edu.id} delay={i * 0.05} className="py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="font-display font-semibold">{edu.degree}</dt>
                <span className="text-muted-foreground font-mono text-xs">
                  {dateRange(edu.from, edu.to, false, { locale })}
                </span>
              </div>
              <dd className="text-muted-foreground mt-1 text-sm">
                {edu.institution}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
