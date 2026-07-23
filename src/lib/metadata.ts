import type { Metadata } from "next";

import { getProfile, getServiceBySlug } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import {
  DEFAULT_LOCALE,
  type Locale,
  OG_LOCALES,
  SITE_URL,
  absoluteUrl,
  alternatesFor,
} from "@/lib/site";

/**
 * Layout-level defaults shared by every page in a locale: the metadata base,
 * the title template, and the site-wide OG/verification. Per-page
 * generateMetadata (below) overrides the title, description and canonical.
 */
export function baseMetadata(locale: Locale): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Abdalla Mostafa — Senior Software Engineer",
      template: "%s — Abdalla Mostafa",
    },
    description: FALLBACK_DESCRIPTION,
    authors: [{ name: "Abdalla Mostafa" }],
    creator: "Abdalla Mostafa",
    alternates: alternatesFor("/", locale),
    openGraph: {
      type: "website",
      locale: OG_LOCALES[locale],
      url: absoluteUrl("/", locale),
      siteName: "Abdalla Mostafa",
      // The card image comes from the file-based opengraph-image route per
      // segment — Next injects those tags automatically, so none are set here.
    },
    twitter: {
      card: "summary_large_image",
    },
    // Search Console proves ownership through this tag. Omitted entirely when
    // the token isn't set, rather than emitting an empty meta.
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
      : {}),
  };
}

// Metadata comes from the CMS, with the values in layout.tsx as the fallback —
// so editing a headline in /admin changes the SERP title, and an unreachable
// database degrades to the hardcoded defaults instead of an empty <title>.

const FALLBACK_DESCRIPTION =
  "Senior Software Engineer building scalable web platforms, process automation, and payment integrations that help businesses run smoother.";

type SeoMeta = {
  title?: string | null;
  description?: string | null;
  image?: unknown;
};

/**
 * Locales this page may be advertised in.
 *
 * Arabic only counts once its translation has been reviewed. Advertising an
 * unreviewed page through hreflang would invite Google to index the English
 * fallback text as Arabic.
 */
function availableLocales(translationReviewed?: boolean | null): Locale[] {
  return translationReviewed ? ["en", "ar"] : ["en"];
}

/** `noindex` for an Arabic page whose translation is still in review. */
function robotsFor(locale: Locale, translationReviewed?: boolean | null) {
  if (locale === DEFAULT_LOCALE || translationReviewed) return undefined;
  return { index: false, follow: true };
}

function firstSentence(text?: string | null, limit = 160) {
  if (!text) return undefined;
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= limit) return flat;
  return `${flat.slice(0, limit - 1).trimEnd()}…`;
}

function buildOpenGraph({
  title,
  description,
  path,
  locale,
}: {
  title: string;
  description?: string;
  path: string;
  locale: Locale;
}) {
  return {
    title,
    description,
    url: absoluteUrl(path, locale),
    type: "website" as const,
    locale: OG_LOCALES[locale],
    // Card image comes from the segment's opengraph-image route.
  };
}

export async function buildHomeMetadata(locale: Locale): Promise<Metadata> {
  const profile = await getProfile(locale);
  const meta = (profile?.meta ?? {}) as SeoMeta;

  const title =
    meta.title ||
    (profile ? `${profile.name} — ${profile.headline}` : undefined);
  const description =
    meta.description ||
    firstSentence(profile?.tagline) ||
    firstSentence(profile?.about) ||
    FALLBACK_DESCRIPTION;
  const available = availableLocales(profile?.translationReviewed);

  return {
    // `absolute` because the site-wide template appends the name, and the home
    // title already contains it.
    ...(title ? { title: { absolute: title } } : {}),
    description,
    alternates: alternatesFor("/", locale, available),
    robots: robotsFor(locale, profile?.translationReviewed),
    openGraph: buildOpenGraph({
      title: title ?? "Abdalla Mostafa",
      description,
      path: "/",
      locale,
    }),
    twitter: { card: "summary_large_image", title, description },
  };
}

export async function buildServicesIndexMetadata(
  locale: Locale,
): Promise<Metadata> {
  const [profile, dict] = [await getProfile(locale), getDictionary(locale)];
  const available = availableLocales(profile?.translationReviewed);

  return {
    title: dict.services.title,
    description: dict.services.description,
    alternates: alternatesFor("/services", locale, available),
    robots: robotsFor(locale, profile?.translationReviewed),
    openGraph: buildOpenGraph({
      title: dict.services.title,
      description: dict.services.description,
      path: "/services",
      locale,
    }),
    twitter: {
      card: "summary_large_image",
      title: dict.services.title,
      description: dict.services.description,
    },
  };
}

export async function buildServiceMetadata(
  slug: string,
  locale: Locale,
): Promise<Metadata> {
  const service = await getServiceBySlug(slug, locale);
  if (!service) return { title: "Not found", robots: { index: false } };

  const meta = (service.meta ?? {}) as SeoMeta;
  const path = `/services/${service.slug}`;
  const title = meta.title || service.title;
  const description =
    meta.description ||
    firstSentence(service.teaser) ||
    firstSentence(service.description) ||
    FALLBACK_DESCRIPTION;
  const available = availableLocales(service.translationReviewed);

  return {
    title,
    description,
    alternates: alternatesFor(path, locale, available),
    robots: robotsFor(locale, service.translationReviewed),
    openGraph: buildOpenGraph({
      title,
      description,
      path,
      locale,
    }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
