import { Clock, Globe, Handshake, Languages } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import type { Dictionary } from "@/lib/i18n";
import type { Profile } from "@/payload-types";

type Availability = NonNullable<Profile["availability"]>;

function Block({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="bg-primary/10 text-primary grid size-9 shrink-0 place-items-center rounded-lg">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          {label}
        </p>
        <div className="mt-1.5 text-sm">{children}</div>
      </div>
    </div>
  );
}

export function WhereIWork({
  availability,
  dict,
}: {
  availability: Availability;
  dict: Dictionary;
}) {
  const regions = availability.regions ?? [];
  const languages = availability.languages ?? [];
  const engagements = availability.engagementTypes ?? [];

  // Nothing filled in yet — render nothing rather than an empty scaffold.
  if (
    regions.length === 0 &&
    languages.length === 0 &&
    engagements.length === 0 &&
    !availability.timezone
  ) {
    return null;
  }

  return (
    <section
      id="availability"
      className="scroll-mt-20 px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={dict.whereIWork.eyebrow}
          title={dict.whereIWork.title}
          description={availability.intro ?? undefined}
        />

        <Reveal className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {regions.length > 0 ? (
            <Block
              icon={<Globe className="size-4.5" />}
              label={dict.whereIWork.regions}
            >
              <ul className="space-y-1">
                {regions.map((region, i) => (
                  <li key={i}>
                    {region.name}
                    {region.note ? (
                      <span className="text-muted-foreground">
                        {" "}
                        — {region.note}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          {availability.timezone || availability.overlapHours ? (
            <Block
              icon={<Clock className="size-4.5" />}
              label={dict.whereIWork.hours}
            >
              {availability.timezone ? (
                <p className="font-mono">{availability.timezone}</p>
              ) : null}
              {availability.overlapHours ? (
                <p className="text-muted-foreground">
                  {availability.overlapHours}
                </p>
              ) : null}
            </Block>
          ) : null}

          {engagements.length > 0 ? (
            <Block
              icon={<Handshake className="size-4.5" />}
              label={dict.whereIWork.openTo}
            >
              <ul className="space-y-1">
                {engagements.map((type) => (
                  <li key={type}>{dict.whereIWork.engagement[type]}</li>
                ))}
              </ul>
            </Block>
          ) : null}

          {languages.length > 0 ? (
            <Block
              icon={<Languages className="size-4.5" />}
              label={dict.whereIWork.languages}
            >
              <ul className="space-y-1">
                {languages.map((language, i) => (
                  <li key={i}>
                    {language.name}
                    {language.proficiency ? (
                      <span className="text-muted-foreground">
                        {" "}
                        — {dict.whereIWork.proficiency[language.proficiency]}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
