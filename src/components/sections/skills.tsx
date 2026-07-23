import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import type { Profile } from "@/payload-types";

export function Skills({ profile }: { profile: Profile }) {
  const soft = (profile.skills ?? []).map((s) => s.skill);
  const tech = (profile.techStack ?? []).map((t) => t.name);

  return (
    <section
      id="skills"
      className="scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Skills"
          count={`${tech.length} tools`}
          title="What I bring to the table"
          description="Engineering depth, and the working habits that keep projects on track."
        />

        {/* Previously two tabs, which hid half of this behind a click on a page
            whose whole job is being scannable. Both groups are visible now, told
            apart by weight rather than by a control. */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,18rem)_1fr]">
          <Reveal>
            <h3 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
              How I work
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
              Tech stack
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
