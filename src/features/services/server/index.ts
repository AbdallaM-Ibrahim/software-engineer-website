import "server-only";

import { cachedRead, cachedReadBy } from "@/shared/cms/cached-read";
import { getPayloadClient } from "@/shared/cms/payload";
import { DEFAULT_LOCALE, type Locale } from "@/shared/site";

import { SERVICES_TAG } from "../model/tags";

export const getServices = cachedRead(
  SERVICES_TAG,
  SERVICES_TAG,
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
  return cachedReadBy(
    ["service", slug, locale],
    SERVICES_TAG,
    null,
    async () => {
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
    },
    draft,
  );
}
