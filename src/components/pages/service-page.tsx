import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
import { Footer } from "@/components/sections/footer";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { ServiceToc, hasRail } from "@/components/sections/service-toc";
import {
  type Heading,
  extractHeadings,
  lexicalText,
  uniqueHeadingId,
} from "@/lib/headings";
import { cn } from "@/lib/utils";
import {
  type JSXConvertersFunction,
  RichText,
} from "@payloadcms/richtext-lexical/react";
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

  // The contents list the authored h2s plus the sections this page adds itself,
  // so it is useful structure even when the body is short.
  const headings: Heading[] = [
    ...extractHeadings(service.body),
    ...(faq.length > 0 ? [{ id: "faq", text: dict.services.faqTitle }] : []),
    ...(related.length > 0
      ? [{ id: "proof", text: dict.services.relatedTitle }]
      : []),
    { id: "contact", text: dict.services.ctaTitle },
  ];

  // Stamps ids onto the authored h2s so the contents can link to them. RichText
  // calls this once per render, so the counter here matches the one inside
  // extractHeadings and the two agree on every id.
  const converters: JSXConvertersFunction = ({ defaultConverters }) => {
    const used = new Map<string, number>();
    return {
      ...defaultConverters,
      heading: ({ node, nodesToJSX }) => {
        const Tag = node.tag;
        const children = nodesToJSX({ nodes: node.children });
        const id = Tag === "h2" ? uniqueHeadingId(lexicalText(node), used) : "";
        return <Tag id={id || undefined}>{children}</Tag>;
      },
    };
  };

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
      <main
        id="main"
        tabIndex={-1}
        className="flex-1 px-4 pt-24 pb-16 focus:outline-none sm:px-6 sm:pt-28 lg:px-8"
      >
        <div
          className={cn(
            "mx-auto max-w-6xl",
            // The rail takes the start margin; without one the article keeps
            // the page to itself rather than sitting in an offset column.
            hasRail(headings) &&
              "lg:grid lg:grid-cols-[14rem_minmax(0,48rem)] lg:justify-center lg:gap-x-10",
          )}
        >
          {hasRail(headings) ? (
            <ServiceToc
              headings={headings}
              label={dict.services.onThisPage}
              variant="rail"
            />
          ) : null}

          <article className="mx-auto w-full max-w-3xl lg:mx-0">
            {/* Breadcrumb trail, matching the BreadcrumbList in the schema so what
              a reader sees and what a crawler reads are the same path. */}
            <nav
              aria-label={dict.nav.breadcrumb}
              className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs"
            >
              <Link
                href={localePath("/services", locale)}
                className="hover:text-foreground"
              >
                {dict.services.eyebrow}
              </Link>
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

            <ServiceToc
              headings={headings}
              label={dict.services.onThisPage}
              variant="disclosure"
            />

            {service.body ? (
              <div className="rich-text mt-10">
                <RichText data={service.body} converters={converters} />
              </div>
            ) : null}

            {faq.length > 0 ? (
              <section id="faq" className="mt-14 scroll-mt-20">
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
              <section id="proof" className="mt-14 scroll-mt-20">
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
            {/* The nav's call to action scrolls here rather than leaving for the
              home form — this is the conversion point on a service page. */}
            <section
              id="contact"
              className="bg-muted/40 mt-14 scroll-mt-20 rounded-xl border p-6 sm:p-8"
            >
              <h2 className="font-display text-xl font-bold">
                {dict.services.ctaTitle}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                {dict.services.ctaDescription}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {whatsapp ? (
                  <Button asChild>
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                      <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                    </a>
                  </Button>
                ) : null}
              </div>
            </section>
          </article>
        </div>
      </main>
      {profile ? (
        <Footer profile={profile} dict={dict} locale={locale} />
      ) : null}
    </>
  );
}
