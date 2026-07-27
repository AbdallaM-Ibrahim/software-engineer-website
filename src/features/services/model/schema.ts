import { PERSON_ID } from "@/features/profile/model";
import { type Node, clean } from "@/features/seo/model";
import { type Locale, absoluteUrl } from "@/shared/site";
import type { Service } from "@/payload-types";

/**
 * A service page's own nodes. Both reference the site-wide Person by `@id`
 * rather than restating it, so a crawler reads one provider across the site.
 */

export function buildService(service: Service, locale: Locale): Node {
  const url = absoluteUrl(`/services/${service.slug}`, locale);
  return clean({
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.title,
    serviceType: service.serviceType ?? service.title,
    description: service.description,
    url,
    provider: { "@id": PERSON_ID },
    inLanguage: locale,
  });
}

export function buildFaqPage(service: Service, locale: Locale): Node | null {
  const faq = service.faq ?? [];
  if (faq.length === 0) return null;

  const url = absoluteUrl(`/services/${service.slug}`, locale);
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    inLanguage: locale,
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
