import {
  ArrowRight,
  BarChart3,
  Code2,
  CreditCard,
  Workflow,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { toParagraphs } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import { type Locale, localePath } from "@/lib/site";
import type { Profile, Service } from "@/payload-types";

const ICONS = {
  code: Code2,
  automation: Workflow,
  payments: CreditCard,
  data: BarChart3,
} as const;

export function About({
  profile,
  services,
  dict,
  locale,
}: {
  profile: Profile;
  services: Service[];
  dict: Dictionary;
  locale: Locale;
}) {
  const paragraphs = toParagraphs(profile.about);

  return (
    <section
      id="about"
      className="scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={dict.about.eyebrow}
          count={dict.about.count(services.length)}
          title={dict.about.title}
        />

        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          <Reveal className="space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service, i) => {
              const Icon = ICONS[service.icon ?? "code"] ?? Code2;
              // The card shows the teaser; the full pitch lives on the service
              // page. Running the same paragraph on both would be a duplicate,
              // and Google picks which of the two to keep.
              const summary = service.teaser || service.description;
              const href = service.slug
                ? localePath(`/services/${service.slug}`, locale)
                : null;

              const body = (
                <Card className="h-full gap-3 py-5 transition-colors group-hover:border-primary/50">
                  <CardContent className="space-y-2">
                    <div className="bg-primary/10 text-primary grid size-10 place-items-center rounded-lg">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="font-display font-semibold">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {summary}
                    </p>
                    {href ? (
                      <p className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                        {dict.services.readMore}
                        <ArrowRight className="size-3.5 rtl:rotate-180" />
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              );

              return (
                <Reveal key={service.id} delay={i * 0.05}>
                  {href ? (
                    <a href={href} className="group block h-full">
                      {body}
                    </a>
                  ) : (
                    body
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
