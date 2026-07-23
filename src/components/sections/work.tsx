import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { type Dictionary, caseStudyStrings } from "@/lib/i18n";
import type { CaseStudy } from "@/payload-types";

export function Work({
  items,
  dict,
}: {
  items: CaseStudy[];
  dict: Dictionary;
}) {
  if (items.length === 0) return null;

  const cardStrings = caseStudyStrings(dict);

  return (
    <section
      id="work"
      className="scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={dict.work.eyebrow}
          count={dict.work.count(items.length)}
          title={dict.work.title}
          description={dict.work.description}
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((study, i) => (
            <Reveal key={study.id} delay={i * 0.06}>
              <CaseStudyCard study={study} t={cardStrings} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
