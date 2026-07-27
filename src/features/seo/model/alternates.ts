import {
  DEFAULT_LOCALE,
  LOCALE_TAGS,
  LOCALES,
  type Locale,
  absoluteUrl,
} from "@/shared/site";

/**
 * `alternates.languages` for a page, restricted to the locales that are
 * actually indexable for it — an Arabic translation still awaiting review is
 * excluded so it is never advertised as a valid alternate.
 */
export function languageAlternates(
  path: string,
  available: readonly Locale[] = LOCALES,
) {
  const languages: Record<string, string> = {};
  for (const locale of available) {
    languages[LOCALE_TAGS[locale]] = absoluteUrl(path, locale);
  }
  if (available.includes(DEFAULT_LOCALE)) {
    languages["x-default"] = absoluteUrl(path, DEFAULT_LOCALE);
  }
  return languages;
}

/** Canonical + hreflang block, spread into a page's `metadata.alternates`. */
export function alternatesFor(
  path: string,
  locale: Locale,
  available: readonly Locale[] = LOCALES,
) {
  return {
    canonical: absoluteUrl(path, locale),
    languages: languageAlternates(path, available),
  };
}
