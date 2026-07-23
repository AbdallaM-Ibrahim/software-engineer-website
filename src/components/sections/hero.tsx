import { ArrowRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { MetricStrip, type Metric } from "@/components/metric-strip";
import type { Profile } from "@/payload-types";

export function Hero({
  profile,
  metrics,
}: {
  profile: Profile;
  metrics: Metric[];
}) {
  const github = profile.contact?.github;
  const linkedin = profile.contact?.linkedin;

  return (
    <section
      id="top"
      className="px-4 pt-28 pb-14 sm:px-6 sm:pt-36 sm:pb-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <p className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
            {profile.headline}
          </p>
          <h1 className="font-display mt-5 text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-lg text-pretty">
            I build scalable web platforms, process automation, and reliable
            payment systems that help businesses run smoother.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href="#work">
                View my work <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#contact">
                <Mail className="size-4" /> Get in touch
              </a>
            </Button>
            <div className="ml-1 flex items-center gap-1">
              {github ? (
                <Button asChild variant="ghost" size="icon" aria-label="GitHub">
                  <a href={github} target="_blank" rel="noopener noreferrer">
                    <GitHubIcon className="size-5" />
                  </a>
                </Button>
              ) : null}
              {linkedin ? (
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  aria-label="LinkedIn"
                >
                  <a href={linkedin} target="_blank" rel="noopener noreferrer">
                    <LinkedInIcon className="size-5" />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </Reveal>

        {/* The proof, immediately — not three scrolls down behind a dialog. */}
        <Reveal delay={0.12}>
          <MetricStrip metrics={metrics} className="mt-14 sm:mt-16" />
        </Reveal>
      </div>
    </section>
  );
}
