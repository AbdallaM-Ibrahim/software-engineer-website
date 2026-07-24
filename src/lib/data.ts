import { unstable_cache } from "next/cache";

import { getPayloadClient } from "@/lib/payload";
import { DEFAULT_LOCALE, type Locale } from "@/lib/site";

// Server-side data access for the portfolio frontend. Each helper reads through
// the Payload Local API (no HTTP round-trip) and tolerates an unseeded /
// unreachable DB by returning an empty value.
//
// Reads are cached and tagged. Payload's afterChange hooks (src/lib/revalidate.ts)
// flush the matching tag on save, so the live page updates immediately without
// paying a database round-trip on every visit.
//
// The try/catch sits OUTSIDE unstable_cache, and the inner read is allowed to
// throw: unstable_cache never stores a rejected promise, so a transient DB
// failure degrades to the empty value for that one request without poisoning
// the cache with a null that would then be served until the next revalidation.
// (An earlier version caught inside the cached function and cached the null,
// which stranded the page on its EmptyState after a single blip.)
//
// `draft` bypasses the cache entirely — the admin's live-preview iframe must see
// unpublished edits, which a cached response would hide.
//
// Two guards against stale cache:
//   CACHE_VERSION is part of every key. A write made OUTSIDE the running server
//   (a seed or translate script) can't fire the revalidate hook on the deployed
//   instance, so its Data Cache — which Vercel persists across deployments —
//   keeps serving the pre-write value. Bumping this abandons those poisoned
//   entries; the new keys miss and read fresh.
//
//   `revalidate` gives every entry a time bound so the same out-of-band write
//   self-heals within the window even without a bump. Normal edits through
//   /admin still update instantly via the tag hook; this only backstops writes
//   the server never saw.
const CACHE_VERSION = "2";
const CACHE_TTL_SECONDS = 3600;

type Read<T> = (locale: Locale, draft: boolean) => Promise<T>;

function cachedRead<T>(key: string, tag: string, empty: T, read: Read<T>) {
  return async (locale: Locale = DEFAULT_LOCALE, draft = false): Promise<T> => {
    try {
      if (draft) return await read(locale, true);
      return await unstable_cache(
        () => read(locale, false),
        [CACHE_VERSION, key, locale],
        { tags: [tag], revalidate: CACHE_TTL_SECONDS },
      )();
    } catch {
      return empty;
    }
  };
}

export const getProfile = cachedRead(
  "profile",
  "profile",
  null,
  async (locale) => {
    const payload = await getPayloadClient();
    return await payload.findGlobal({
      slug: "profile",
      depth: 1,
      locale,
      fallbackLocale: DEFAULT_LOCALE,
    });
  },
);

export const getServices = cachedRead(
  "services",
  "services",
  [],
  async (locale, draft) => {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "services",
      sort: "order",
      limit: 100,
      depth: 1,
      locale,
      fallbackLocale: DEFAULT_LOCALE,
      draft,
      // Published only. The Local API runs with full access unless told
      // otherwise, so this is what makes the collection's draft filter apply.
      overrideAccess: draft,
    });
    return res.docs;
  },
);

/** One service by URL slug. `null` when it doesn't exist or isn't published. */
export async function getServiceBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
  draft = false,
) {
  const read = async () => {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "services",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
      locale,
      fallbackLocale: DEFAULT_LOCALE,
      draft,
      overrideAccess: draft,
    });
    return res.docs[0] ?? null;
  };

  try {
    if (draft) return await read();
    return await unstable_cache(
      read,
      [CACHE_VERSION, "service", slug, locale],
      { tags: ["services"], revalidate: CACHE_TTL_SECONDS },
    )();
  } catch {
    return null;
  }
}

export const getSkills = cachedRead("skills", "skills", [], async (locale) => {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "skills",
    // Category first so the two blocks come back already partitioned; `order`
    // then controls the sequence within each.
    sort: ["category", "order"],
    limit: 200,
    depth: 0,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
  });
  return res.docs;
});

export const getExperience = cachedRead(
  "experience",
  "experience",
  [],
  async (locale) => {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "experience",
      sort: "order",
      limit: 100,
      depth: 0,
      locale,
      fallbackLocale: DEFAULT_LOCALE,
    });
    return res.docs;
  },
);

export const getEducation = cachedRead(
  "education",
  "education",
  [],
  async (locale) => {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "education",
      sort: "order",
      limit: 100,
      depth: 0,
      locale,
      fallbackLocale: DEFAULT_LOCALE,
    });
    return res.docs;
  },
);

export const getCaseStudies = cachedRead(
  "case-studies",
  "case-studies",
  [],
  async (locale, draft) => {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "case-studies",
      sort: "order",
      limit: 100,
      depth: 1,
      locale,
      fallbackLocale: DEFAULT_LOCALE,
      draft,
      overrideAccess: draft,
    });
    return res.docs;
  },
);

export const getTestimonials = cachedRead(
  "testimonials",
  "testimonials",
  [],
  async (locale) => {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "testimonials",
      sort: "order",
      limit: 100,
      depth: 0,
      locale,
      fallbackLocale: DEFAULT_LOCALE,
    });
    return res.docs;
  },
);
