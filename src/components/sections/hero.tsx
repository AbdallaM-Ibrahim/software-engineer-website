import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { MetricStrip, type Metric } from "@/components/metric-strip";
import { findLink } from "@/lib/contact-links";
import type { Dictionary } from "@/lib/i18n";
import { asMedia, mediaAlt } from "@/lib/media";
import { type Locale, sectionHref } from "@/lib/site";
import type { Profile } from "@/payload-types";

const FALLBACK_TAGLINE =
  "I build scalable web platforms, process automation, and reliable payment systems that help businesses run smoother.";

export function Hero({
  profile,
  metrics,
  dict,
  locale,
}: {
  profile: Profile;
  metrics: Metric[];
  dict: Dictionary;
  locale: Locale;
}) {
  // The hero carries the two professional profiles a reader clicks straight
  // through to. Every other channel — email, WhatsApp, the rest — lives in the
  // Contact section rather than competing here.
  const linkedin = findLink(profile, "linkedin")?.url;
  const github = findLink(profile, "github")?.url;

  const photo = asMedia(profile.heroImage);
  const photoUrl = photo?.url ?? null;

  return (
    <section
      id="top"
      className="px-4 pt-28 pb-14 sm:px-6 sm:pt-36 sm:pb-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* Two tracks rather than `1fr auto`: the portrait gets a column of its
            own so it sits centred in the right half instead of pinned to the
            container edge. */}
        <div className="grid items-center gap-10 md:grid-cols-[3fr_2fr]">
          <Reveal className="max-w-3xl">
            {photo && photoUrl ? (
              // Phone-only identity chip: a compact round avatar leads the
              // column so the face supports the name without dominating the
              // fold. The square portrait beside the text takes over from md,
              // where there is room for it.
              <div className="border-foreground/10 bg-muted relative mb-6 aspect-square w-20 overflow-hidden rounded-full border shadow-sm md:hidden">
                <Image
                  src={photoUrl}
                  alt={mediaAlt(photo, profile.name)}
                  fill
                  priority
                  sizes="5rem"
                  className="object-cover"
                />
              </div>
            ) : null}
            <p className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
              {profile.headline}
            </p>
            <h1 className="font-display mt-5 text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              {profile.name}
            </h1>
            <p className="text-muted-foreground mt-6 max-w-xl text-lg text-pretty">
              {profile.tagline || FALLBACK_TAGLINE}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <a href={sectionHref("work", locale)}>
                  {dict.hero.viewWork}{" "}
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={sectionHref("contact", locale)}>
                  <Mail className="size-4" /> {dict.hero.getInTouch}
                </a>
              </Button>
              <div className="ms-1 flex items-center gap-1">
                {linkedin ? (
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    aria-label={dict.hero.linkedin}
                  >
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedInIcon className="size-5" />
                    </a>
                  </Button>
                ) : null}
                {github ? (
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    aria-label={dict.hero.github}
                  >
                    <a href={github} target="_blank" rel="noopener noreferrer">
                      <GitHubIcon className="size-5" />
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </Reveal>

          {photo && photoUrl ? (
            // Beside the text from md up — tablet and desktop share this layout.
            // Below md the round avatar above the copy stands in.
            <Reveal delay={0.08} className="hidden md:flex md:justify-center">
              <div className="border-foreground/10 bg-muted relative aspect-square w-48 overflow-hidden rounded-2xl border shadow-sm lg:w-64">
                <Image
                  src={photoUrl}
                  alt={mediaAlt(photo, profile.name)}
                  fill
                  priority
                  sizes="(min-width: 1024px) 16rem, 12rem"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ) : null}
        </div>

        {/* The proof, immediately — not three scrolls down behind a dialog. */}
        <Reveal delay={0.12}>
          <MetricStrip metrics={metrics} className="mt-14 sm:mt-16" />
        </Reveal>
      </div>
    </section>
  );
}
