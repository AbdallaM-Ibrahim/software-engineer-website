/**
 * Single source of truth for the site's public URL and locale routing.
 *
 * Every absolute URL the site emits — canonicals, hreflang alternates, the
 * sitemap, JSON-LD `@id`s, OG image URLs — resolves through here, so moving to
 * a different domain is one env var rather than a grep.
 *
 * NOTE: `src/payload.config.ts` deliberately inlines its own copy of SITE_URL.
 * That file is loaded by the Payload CLI through tsx, which does not resolve the
 * `@/*` alias. Keep the two in sync.
 */

export const LOCALES = ["en", "ar"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Locales rendered right-to-left. Drives `dir` on <html>. */
export const RTL_LOCALES: readonly Locale[] = ["ar"];

/** BCP 47 tags for `hreflang` and OpenGraph `locale`. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: "en",
  ar: "ar",
};

export const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  ar: "ar_EG",
};

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

/** Trailing slash stripped so `${SITE_URL}${path}` never doubles up. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://abdalla.futuresolve.net"
).replace(/\/+$/, "");

/**
 * Locale-prefixed pathname.
 *
 * English lives at the root (`/services/x`) and Arabic under `/ar`
 * (`/ar/services/x`). Keeping English unprefixed means none of the URLs that
 * exist today move, so nothing needs redirecting.
 */
export function localePath(path: string, locale: Locale = DEFAULT_LOCALE) {
  const clean = path === "/" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  if (locale === DEFAULT_LOCALE) return clean || "/";
  return `/${locale}${clean}`;
}

/**
 * Link to a section of the home page.
 *
 * These render on the service pages too, where a bare `#work` fragment points
 * at nothing, so they are always root-relative and locale-aware.
 */
export function sectionHref(id: string, locale: Locale = DEFAULT_LOCALE) {
  const base = localePath("/", locale);
  return `${base === "/" ? "" : base}/#${id}`;
}

/** Absolute URL for a path in a given locale. */
export function absoluteUrl(path: string, locale: Locale = DEFAULT_LOCALE) {
  return `${SITE_URL}${localePath(path, locale)}`;
}

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
