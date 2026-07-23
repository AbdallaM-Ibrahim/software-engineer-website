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
import type { CaseStudy } from "@/payload-types";

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

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const uploaded =
    study.thumbnail && typeof study.thumbnail === "object"
      ? study.thumbnail
      : null;
  // Screenshots captured from the live sites live in public/case-studies/.
  const staticShot = study.slug ? `/case-studies/${study.slug}.jpg` : null;
  const name = study.shortName || study.title;
  const metric = study.metric;

  return (
    <Dialog>
      <Card className="group flex flex-col overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="bg-muted relative aspect-[16/10] overflow-hidden border-b">
          {uploaded?.url ? (
            // biome-ignore lint/performance/noImgElement: CMS media host is unknown until S3 storage is configured, so next/image would need remotePatterns entries that don't exist yet. The static screenshots below do use next/image.
            <img
              src={uploaded.url}
              alt={uploaded.alt ?? name}
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : staticShot ? (
            <Image
              src={staticShot}
              alt={`${name} home page`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
                    <span className="text-primary mx-1.5" aria-hidden="true">
                      →
                    </span>
                  </>
                ) : null}
                {metric.value}
                {!metric.before && metric.direction ? (
                  <span className="text-primary ml-1.5" aria-hidden="true">
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
                Case study <ArrowUpRight className="size-4" />
              </Button>
            </DialogTrigger>
            {study.link ? (
              <Button asChild size="sm" variant="ghost">
                <a href={study.link} target="_blank" rel="noopener noreferrer">
                  Visit <ExternalLink className="size-3.5" />
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
          <StarBlock label="Result" text={study.star?.result} bullets />
          <StarBlock label="Situation" text={study.star?.situation} />
          <StarBlock label="Task" text={study.star?.task} />
          <StarBlock label="Action" text={study.star?.action} bullets />
        </div>
      </DialogContent>
    </Dialog>
  );
}
