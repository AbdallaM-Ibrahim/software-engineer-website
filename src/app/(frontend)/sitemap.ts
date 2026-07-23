import type { MetadataRoute } from "next";

import { getProfile, getServices } from "@/lib/data";
import {
  DEFAULT_LOCALE,
  type Locale,
  absoluteUrl,
  languageAlternates,
} from "@/lib/site";

// The home page and the case studies live at one URL — the studies are a dialog
// on the home page, not separate documents, so they are deliberately not listed.
// Services are real pages and each gets an entry, in every locale it is
// published and reviewed in.

/** Which locales a document may appear in. Arabic only once reviewed. */
function localesFor(reviewed?: boolean | null): Locale[] {
  return reviewed ? ["en", "ar"] : ["en"];
}

function entriesForPath(
  path: string,
  locales: Locale[],
  lastModified: Date,
  priority: number,
): MetadataRoute.Sitemap {
  const alternates = { languages: languageAlternates(path, locales) };
  return locales.map((locale) => ({
    url: absoluteUrl(path, locale),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: locale === DEFAULT_LOCALE ? priority : priority * 0.9,
    alternates,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [profile, services] = await Promise.all([
    getProfile("en"),
    getServices("en"),
  ]);

  const homeLocales = localesFor(profile?.translationReviewed);
  const homeModified = profile?.updatedAt
    ? new Date(profile.updatedAt)
    : new Date();

  // The services hub is indexable whenever the home is — it has no translation
  // gate of its own, only the copy on it.
  const serviceMostRecent = services.reduce<Date>((latest, service) => {
    const updated = service.updatedAt ? new Date(service.updatedAt) : null;
    return updated && updated > latest ? updated : latest;
  }, homeModified);

  return [
    ...entriesForPath("/", homeLocales, homeModified, 1),
    ...entriesForPath("/services", homeLocales, serviceMostRecent, 0.8),
    ...services
      .filter((service) => service.slug)
      .flatMap((service) =>
        entriesForPath(
          `/services/${service.slug}`,
          localesFor(service.translationReviewed),
          service.updatedAt ? new Date(service.updatedAt) : homeModified,
          0.7,
        ),
      ),
  ];
}
