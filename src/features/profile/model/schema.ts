import { type Node, clean } from "@/features/seo/model";
import { mediaUrl } from "@/shared/cms/media";
import { type Locale, absoluteUrl } from "@/shared/site";
import type {
  CaseStudy,
  Education,
  Experience,
  Profile,
  Skill,
} from "@/payload-types";

import { contactLinks } from "./contact-links";

/**
 * The Person this whole site is about, and the two nodes that frame it.
 *
 * The `@id`s are stable and exported: a service page references this same
 * Person as its provider rather than declaring a second, unrelated copy.
 */

export const PERSON_ID = `${absoluteUrl("/")}#person`;
export const WEBSITE_ID = `${absoluteUrl("/")}#website`;

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
