import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import type { CaseStudy } from "@/payload-types";

export function Work({ items }: { items: CaseStudy[] }) {
  if (items.length === 0) return null;

  return (
    <section
      id="work"
      className="scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Work"
          count={`${items.length} case ${items.length === 1 ? "study" : "studies"}`}
          title="Selected case studies"
          description="Real projects and the numbers they moved. Open any card for the full breakdown."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((study, i) => (
            <Reveal key={study.id} delay={i * 0.06}>
              <CaseStudyCard study={study} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
