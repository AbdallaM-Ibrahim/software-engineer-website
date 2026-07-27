import "server-only";

import { cachedRead } from "@/shared/cms/cached-read";
import { getPayloadClient } from "@/shared/cms/payload";
import { DEFAULT_LOCALE } from "@/shared/site";

import { PROFILE_TAG } from "../model/tags";

/** Identity, bio, availability and contact details. `null` when unseeded. */
export const getProfile = cachedRead(
  PROFILE_TAG,
  PROFILE_TAG,
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
