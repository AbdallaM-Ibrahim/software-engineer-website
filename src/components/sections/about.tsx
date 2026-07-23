import { BarChart3, Code2, CreditCard, Workflow } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { toParagraphs } from "@/lib/format";
import type { Profile } from "@/payload-types";

const ICONS = {
  code: Code2,
  automation: Workflow,
  payments: CreditCard,
  data: BarChart3,
} as const;

export function About({ profile }: { profile: Profile }) {
  const paragraphs = toParagraphs(profile.about);
  const services = profile.services ?? [];

  return (
    <section
      id="about"
      className="scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="About"
          count={`${services.length} services`}
          title="Turning complex operations into simple workflows"
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
              return (
                <Reveal key={service.id ?? i} delay={i * 0.05}>
                  <Card className="h-full gap-3 py-5">
                    <CardContent className="space-y-2">
                      <div className="bg-primary/10 text-primary grid size-10 place-items-center rounded-lg">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="font-display font-semibold">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
