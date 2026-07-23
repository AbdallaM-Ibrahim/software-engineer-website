import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowUpRight, ChevronRight, Mail } from "lucide-react";

import { getProfile, getServiceBySlug } from "@/lib/data";
import { caseStudyStrings, getDictionary } from "@/lib/i18n";
import { JsonLd } from "@/components/json-ld";
import {
  buildBreadcrumbs,
  buildFaqPage,
  buildGraph,
  buildService,
} from "@/lib/schema";
import { mediaAlt, mediaSize, mediaUrl } from "@/lib/media";
import { type Locale, localePath } from "@/lib/site";
import { findLink, resolveWhatsapp } from "@/lib/contact-links";
import { WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { CaseStudy } from "@/payload-types";

/**
 * A single service landing page at /services/<slug>.
 *
 * This is where the commercial-intent keywords for each service live — the home
 * page can only carry so many. The body is authored rich text, the FAQ becomes
 * an FAQPage in structured data, and the related case studies are both proof
 * and the internal links that tie the page into the rest of the site.
 */
export async function ServicePage({
  slug,
  locale,
  draft = false,
}: {
  slug: string;
  locale: Locale;
  draft?: boolean;
}) {
  const dict = getDictionary(locale);
  const [profile, service] = await Promise.all([
    getProfile(locale, draft),
    getServiceBySlug(slug, locale, draft),
  ]);

  if (!service) notFound();

  const heroImage = service.heroImage;
  const heroUrl = mediaUrl(heroImage);
  const heroDims = mediaSize(heroImage);

  const related = (service.relatedCaseStudies ?? []).filter(
    (c): c is CaseStudy => typeof c === "object" && c !== null,
  );
  const faq = service.faq ?? [];

  const email = profile?.contact?.email;
  const whatsapp = profile ? resolveWhatsapp(profile) : null;
  const linkedin = profile ? findLink(profile, "linkedin")?.url : null;

  const graph = buildGraph([
    buildService(service, locale),
    buildFaqPage(service, locale),
    buildBreadcrumbs(
      [
        { name: dict.services.breadcrumbHome, path: "/" },
        { name: dict.services.eyebrow, path: "/services" },
        { name: service.title, path: `/services/${service.slug}` },
      ],
      locale,
    ),
  ]);

  return (
    <>
      <JsonLd data={graph} />
      {profile ? (
        <Navbar
          name={profile.name}
          nav={dict.nav}
          switchLabel={dict.common.switchLanguage}
          locale={locale}
        />
      ) : null}
      <main className="flex-1 px-4 pt-28 pb-16 sm:px-6 sm:pt-32 lg:px-8">
        <article className="mx-auto max-w-3xl">
          {/* Breadcrumb trail, matching the BreadcrumbList in the schema so what
              a reader sees and what a crawler reads are the same path. */}
          <nav
            aria-label="Breadcrumb"
            className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs"
          >
            <a
              href={localePath("/services", locale)}
              className="hover:text-foreground"
            >
              {dict.services.eyebrow}
            </a>
            <ChevronRight className="size-3.5 rtl:rotate-180" />
            <span className="text-foreground">{service.title}</span>
          </nav>

          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {service.title}
          </h1>
          <p className="text-muted-foreground mt-5 text-lg text-pretty">
            {service.description}
          </p>

          {heroUrl ? (
            <div className="bg-muted relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border">
              <Image
                src={heroUrl}
                alt={mediaAlt(heroImage, service.title)}
                fill={!heroDims}
                width={heroDims?.width}
                height={heroDims?.height}
                sizes="(min-width: 768px) 48rem, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}

          {service.body ? (
            <div className="rich-text mt-10">
              <RichText data={service.body} />
            </div>
          ) : null}

          {faq.length > 0 ? (
            <section className="mt-14">
              <h2 className="font-display text-2xl font-bold">
                {dict.services.faqTitle}
              </h2>
              <dl className="mt-6 divide-y border-t">
                {faq.map((item, i) => (
                  <div key={i} className="py-5">
                    <dt className="font-display font-semibold">
                      {item.question}
                    </dt>
                    <dd className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {related.length > 0 ? (
            <section className="mt-14">
              <h2 className="font-display text-2xl font-bold">
                {dict.services.relatedTitle}
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {related.map((study, i) => (
                  <Reveal key={study.id} delay={i * 0.06}>
                    <CaseStudyCard study={study} t={caseStudyStrings(dict)} />
                  </Reveal>
                ))}
              </div>
            </section>
          ) : null}

          {/* Inline WhatsApp + email, no form: the fastest path for Gulf/Egypt
              visitors, where WhatsApp is the default channel. The home-page form
              is one click away through the nav for anyone who prefers it. */}
          <section className="bg-muted/40 mt-14 rounded-xl border p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold">
              {dict.services.ctaTitle}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {dict.services.ctaDescription}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {whatsapp ? (
                <Button asChild>
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="size-4" />
                    {dict.services.ctaWhatsapp}
                  </a>
                </Button>
              ) : null}
              {email ? (
                <Button asChild variant={whatsapp ? "outline" : "default"}>
                  <a
                    href={`mailto:${email}?subject=${encodeURIComponent(service.title)}`}
                  >
                    <Mail className="size-4" />
                    {dict.services.ctaEmail}
                  </a>
                </Button>
              ) : null}
              {linkedin ? (
                <Button asChild variant="ghost">
                  <a href={linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                    <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                  </a>
                </Button>
              ) : null}
            </div>
          </section>
        </article>
      </main>
      {profile ? (
        <Footer profile={profile} dict={dict} locale={locale} />
      ) : null}
    </>
  );
}
