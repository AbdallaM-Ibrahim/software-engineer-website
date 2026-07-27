import "server-only";

import { unstable_cache } from "next/cache";

import { DEFAULT_LOCALE, type Locale } from "@/shared/site";

/**
 * The caching contract every feature's data readers go through.
 *
 * Each reader hits the Payload Local API (no HTTP round-trip) and tolerates an
 * unseeded / unreachable DB by returning an empty value.
 *
 * Reads are cached and tagged. Payload's afterChange hooks
 * (src/shared/cms/revalidate.ts) flush the matching tag on save, so the live
 * page updates immediately without paying a database round-trip on every visit.
 *
 * The try/catch sits OUTSIDE unstable_cache, and the inner read is allowed to
 * throw: unstable_cache never stores a rejected promise, so a transient DB
 * failure degrades to the empty value for that one request without poisoning
 * the cache with a null that would then be served until the next revalidation.
 * (An earlier version caught inside the cached function and cached the null,
 * which stranded the page on its EmptyState after a single blip.)
 *
 * `draft` bypasses the cache entirely — the admin's live-preview iframe must see
 * unpublished edits, which a cached response would hide.
 *
 * Two guards against stale cache:
 *   CACHE_VERSION is part of every key. A write made OUTSIDE the running server
 *   (a seed or translate script) can't fire the revalidate hook on the deployed
 *   instance, so its Data Cache — which Vercel persists across deployments —
 *   keeps serving the pre-write value. Bumping this abandons those poisoned
 *   entries; the new keys miss and read fresh. It lives here rather than in a
 *   feature so a bump stays one edit for the whole site.
 *
 *   `revalidate` gives every entry a time bound so the same out-of-band write
 *   self-heals within the window even without a bump. Normal edits through
 *   /admin still update instantly via the tag hook; this only backstops writes
 *   the server never saw.
 */
export const CACHE_VERSION = "5";
export const CACHE_TTL_SECONDS = 3600;

type Read<T> = (locale: Locale, draft: boolean) => Promise<T>;

export function cachedRead<T>(
  key: string,
  tag: string,
  empty: T,
  read: Read<T>,
) {
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

/**
 * Same contract for a read keyed by something other than the locale alone —
 * a single document by slug, say. The caller supplies the extra key parts.
 */
export function cachedReadBy<T>(
  keyParts: string[],
  tag: string,
  empty: T,
  read: () => Promise<T>,
  draft: boolean,
) {
  const run = async (): Promise<T> => {
    try {
      if (draft) return await read();
      return await unstable_cache(read, [CACHE_VERSION, ...keyParts], {
        tags: [tag],
        revalidate: CACHE_TTL_SECONDS,
      })();
    } catch {
      return empty;
    }
  };
  return run();
}
