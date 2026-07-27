import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Code2,
  CreditCard,
  Workflow,
} from "lucide-react";

import { getServices } from "@/features/services/server";
import { getProfile } from "@/features/profile/server";
import { getDictionary } from "@/shared/i18n";
import { JsonLd } from "@/features/seo/ui";
import { buildBreadcrumbs, buildGraph } from "@/features/seo/model";
import { type Locale, localePath } from "@/shared/site";
import { Card, CardContent } from "@/shared/ui/card";
import { Reveal } from "@/shared/ui/reveal";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Footer } from "@/features/profile/ui";
import { EmptyState } from "@/views/shell/empty-state";

const ICONS = {
  code: Code2,
  automation: Workflow,
  payments: CreditCard,
  data: BarChart3,
} as const;

/**
 * The /services hub.
 *
 * A real page, not a redirect: it gives the service pages a breadcrumb parent
 * and a single URL that can rank for the category, and it is where the internal
 * links to each service concentrate.
 */
export async function ServicesIndexPage({
  locale,
  draft = false,
}: {
  locale: Locale;
  draft?: boolean;
}) {
  const dict = getDictionary(locale);
  const [profile, services] = await Promise.all([
    getProfile(locale, draft),
    getServices(locale, draft),
  ]);

  if (!profile) return <EmptyState />;

  const graph = buildGraph([
    buildBreadcrumbs(
      [
        { name: dict.services.breadcrumbHome, path: "/" },
        { name: dict.services.eyebrow, path: "/services" },
      ],
      locale,
    ),
  ]);

  return (
    <>
      <JsonLd data={graph} />
      <main
        id="main"
        tabIndex={-1}
        className="flex-1 px-4 pt-24 pb-16 focus:outline-none sm:px-6 sm:pt-28 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            as="h1"
            eyebrow={dict.services.eyebrow}
            count={dict.services.count(services.length)}
            title={dict.services.title}
            description={dict.services.description}
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {services.map((service, i) => {
              const Icon = ICONS[service.icon ?? "code"] ?? Code2;
              const href = service.slug
                ? localePath(`/services/${service.slug}`, locale)
                : "#";
              return (
                <Reveal key={service.id} delay={i * 0.05}>
                  <Link href={href} className="group block h-full">
                    <Card className="h-full transition-colors group-hover:border-primary/50">
                      <CardContent className="flex h-full flex-col gap-3">
                        <div className="bg-primary/10 text-primary grid size-11 place-items-center rounded-lg">
                          <Icon className="size-5.5" />
                        </div>
                        <h2 className="font-display text-xl font-semibold">
                          {service.title}
                        </h2>
                        <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
                          {service.teaser || service.description}
                        </p>
                        <p className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                          {dict.services.readMore}
                          <ArrowRight className="size-3.5 rtl:rotate-180" />
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </main>
      <Footer profile={profile} dict={dict} locale={locale} />
    </>
  );
}
