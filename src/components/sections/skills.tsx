import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import type { Dictionary } from "@/lib/i18n";
import type { Skill } from "@/payload-types";

export function Skills({
  skills,
  dict,
}: {
  skills: Skill[];
  dict: Dictionary;
}) {
  const soft = skills.filter((s) => s.category === "soft").map((s) => s.name);
  const tech = skills.filter((s) => s.category === "tech").map((s) => s.name);

  return (
    <section
      id="skills"
      className="scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={dict.skills.eyebrow}
          count={dict.skills.count(tech.length)}
          title={dict.skills.title}
          description={dict.skills.description}
        />

        {/* Previously two tabs, which hid half of this behind a click on a page
            whose whole job is being scannable. Both groups are visible now, told
            apart by weight rather than by a control. */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,18rem)_1fr]">
          <Reveal>
            <h3 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
              {dict.skills.howIWork}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {soft.map((name) => (
                <li key={name} className="flex items-baseline gap-2.5">
                  <span className="bg-primary size-1.5 shrink-0 rounded-full" />
                  <span className="font-display font-semibold">{name}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <h3 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
              {dict.skills.techStack}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {tech.map((name) => (
                <Badge
                  key={name}
                  variant="secondary"
                  className="font-mono text-xs font-normal"
                >
                  {name}
                </Badge>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
