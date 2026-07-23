"use client";

import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toLines } from "@/lib/format";
import type { CaseStudyStrings } from "@/lib/i18n";
import { asMedia, mediaAlt } from "@/lib/media";
import type { CaseStudy } from "@/payload-types";

const THUMB_SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

function StarBlock({
  label,
  text,
  bullets,
}: {
  label: string;
  text?: string | null;
  bullets?: boolean;
}) {
  if (!text) return null;
  const lines = bullets ? toLines(text) : [];
  return (
    <div>
      <h4 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
        {label}
      </h4>
      {bullets ? (
        <ul className="mt-2 space-y-1.5 text-sm">
          {lines.map((line, i) => (
            <li key={i} className="flex gap-2">
              <span className="bg-primary/60 mt-2 size-1 shrink-0 rounded-full" />
              <span className="leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm leading-relaxed">{text}</p>
      )}
    </div>
  );
}

export function CaseStudyCard({
  study,
  t,
}: {
  study: CaseStudy;
  // The whole Dictionary can't cross into a client component (its `count`
  // functions aren't serializable), so the caller passes just these strings.
  t: CaseStudyStrings;
}) {
  const uploaded = asMedia(study.thumbnail);
  // Screenshots captured from the live sites live in public/case-studies/.
  const staticShot = study.slug ? `/case-studies/${study.slug}.jpg` : null;
  const name = study.shortName || study.title;
  const metric = study.metric;
  // Uploads and static screenshots both go through next/image now: the CMS
  // host is declared in next.config's remotePatterns, so there is no longer a
  // reason to fall back to a bare <img> that ships no dimensions and shifts the
  // layout as it loads.
  const image = uploaded?.url ?? staticShot;
  const alt = uploaded ? mediaAlt(uploaded, name) : `${name} home page`;

  return (
    <Dialog>
      <Card className="group flex flex-col overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="bg-muted relative aspect-[16/10] overflow-hidden border-b">
          {image ? (
            <Image
              src={image}
              alt={alt}
              fill
              sizes={THUMB_SIZES}
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center p-6">
              <span className="text-muted-foreground text-center font-mono text-sm">
                {name}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <h3 className="font-display leading-snug font-semibold">{name}</h3>

          {metric?.value ? (
            <div>
              <p className="font-mono text-2xl leading-none font-semibold">
                {metric.before ? (
                  <>
                    <span className="text-muted-foreground">
                      {metric.before}
                    </span>
                    {/* Mirrored in RTL: an arrow means "became", and in Arabic
                        that reads right to left. */}
                    <span
                      className="text-primary mx-1.5 inline-block rtl:-scale-x-100"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </>
                ) : null}
                {metric.value}
                {!metric.before && metric.direction ? (
                  <span className="text-primary ms-1.5" aria-hidden="true">
                    {metric.direction === "up" ? "↑" : "↓"}
                  </span>
                ) : null}
              </p>
              {metric.label ? (
                <p className="text-muted-foreground mt-1.5 font-mono text-xs">
                  {metric.label}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-auto flex items-center gap-2 pt-1">
            <DialogTrigger asChild>
              <Button size="sm" variant="secondary">
                {t.openCaseStudy}{" "}
                <ArrowUpRight className="size-4 rtl:-scale-x-100" />
              </Button>
            </DialogTrigger>
            {study.link ? (
              <Button asChild size="sm" variant="ghost">
                <a href={study.link} target="_blank" rel="noopener noreferrer">
                  {t.visit} <ExternalLink className="size-3.5" />
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </Card>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">{study.title}</DialogTitle>
          {study.link ? (
            <DialogDescription asChild>
              <a
                href={study.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex w-fit items-center gap-1 font-mono text-xs hover:underline"
                dir="ltr"
              >
                {study.link.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                <ExternalLink className="size-3.5" />
              </a>
            </DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="space-y-5">
          {/* Result leads: STAR order is how the work was done, not what the
              reader came for. */}
          <StarBlock label={t.star.result} text={study.star?.result} bullets />
          <StarBlock label={t.star.situation} text={study.star?.situation} />
          <StarBlock label={t.star.task} text={study.star?.task} />
          <StarBlock label={t.star.action} text={study.star?.action} bullets />
        </div>
      </DialogContent>
    </Dialog>
  );
}
