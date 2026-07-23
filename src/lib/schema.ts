import { contactLinks } from "@/lib/contact-links";
import { mediaUrl } from "@/lib/media";
import { type Locale, absoluteUrl } from "@/lib/site";
import type {
  CaseStudy,
  Education,
  Experience,
  Profile,
  Service,
  Skill,
} from "@/payload-types";

/**
 * JSON-LD builders.
 *
 * Everything is emitted as one `@graph` per page with stable `@id`s, so the
 * Person defined on the home page is the same node a service page references as
 * its provider rather than a second, unrelated copy of you.
 *
 * Deliberately absent: Review and AggregateRating. Reviews you publish about
 * yourself are not eligible for rich results and are a documented cause of
 * manual actions, so the testimonials stay plain markup.
 */

type Node = Record<string, unknown>;

const PERSON_ID = `${absoluteUrl("/")}#person`;
const WEBSITE_ID = `${absoluteUrl("/")}#website`;

/** Drops undefined/empty keys — an empty schema property is worse than none. */
function clean(node: Node): Node {
  return Object.fromEntries(
    Object.entries(node).filter(([, value]) => {
      if (value === undefined || value === null || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }),
  );
}

export function buildPerson({
  profile,
  skills,
  experience,
  education,
  locale,
}: {
  profile: Profile;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  locale: Locale;
}): Node {
  const links = contactLinks(profile);
  const availability = profile.availability;

  return clean({
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name,
    url: absoluteUrl("/", locale),
    jobTitle: profile.headline,
    description: profile.tagline ?? profile.about?.split("\n")[0],
    image: mediaUrl(profile.heroImage) ?? undefined,
    email: profile.contact?.email
      ? `mailto:${profile.contact.email}`
      : undefined,
    telephone: profile.contact?.phone ?? undefined,
    // The profiles that prove this Person is the same person as the one on
    // LinkedIn and GitHub. This is the single strongest entity signal here.
    sameAs: links.map((link) => link.url),
    knowsAbout: skills.map((skill) => skill.name),
    knowsLanguage: (availability?.languages ?? []).map((language) =>
      clean({
        "@type": "Language",
        name: language.name,
        alternateName: language.code ?? undefined,
      }),
    ),
    // areaServed is how a search engine learns you work in the Gulf without a
    // near-duplicate landing page per city.
    areaServed: (availability?.regions ?? []).map((region) =>
      clean({
        "@type": "Country",
        name: region.name,
        identifier: region.code ?? undefined,
      }),
    ),
    alumniOf: education.map((entry) =>
      clean({
        "@type": "CollegeOrUniversity",
        name: entry.institution,
      }),
    ),
    worksFor: experience
      .filter((job) => job.isPresent)
      .map((job) =>
        clean({
          "@type": "Organization",
          name: job.company,
          url: job.website ?? undefined,
        }),
      ),
    hasOccupation: clean({
      "@type": "Occupation",
      name: profile.headline,
      occupationLocation: (availability?.regions ?? []).map((region) =>
        clean({ "@type": "Country", name: region.name }),
      ),
    }),
  });
}

export function buildWebSite(profile: Profile, locale: Locale): Node {
  return clean({
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl("/", locale),
    name: profile.name,
    inLanguage: locale,
    publisher: { "@id": PERSON_ID },
  });
}

export function buildProfilePage({
  profile,
  locale,
  caseStudies,
}: {
  profile: Profile;
  locale: Locale;
  caseStudies: CaseStudy[];
}): Node {
  return clean({
    "@type": "ProfilePage",
    "@id": `${absoluteUrl("/", locale)}#profilepage`,
    url: absoluteUrl("/", locale),
    name: `${profile.name} — ${profile.headline}`,
    inLanguage: locale,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
    dateModified: profile.updatedAt ?? undefined,
    // The work is listed here rather than as standalone CreativeWork pages —
    // the case studies live in a dialog on this page, not at their own URLs.
    about: caseStudies.map((study) =>
      clean({
        "@type": "CreativeWork",
        name: study.shortName || study.title,
        url: study.link ?? undefined,
      }),
    ),
  });
}

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

export function buildBreadcrumbs(
  trail: { name: string; path: string }[],
  locale: Locale,
): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path, locale),
    })),
  };
}

/** Wraps nodes into the single `@graph` document a page emits. */
export function buildGraph(nodes: (Node | null)[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter((node): node is Node => node !== null),
  };
}
