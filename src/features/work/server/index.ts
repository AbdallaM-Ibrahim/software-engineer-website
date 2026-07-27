import "server-only";

import { cachedRead } from "@/shared/cms/cached-read";
import { getPayloadClient } from "@/shared/cms/payload";
import { DEFAULT_LOCALE } from "@/shared/site";

import { CASE_STUDIES_TAG, TESTIMONIALS_TAG } from "../model/tags";

export const getCaseStudies = cachedRead(
  CASE_STUDIES_TAG,
  CASE_STUDIES_TAG,
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
  TESTIMONIALS_TAG,
  TESTIMONIALS_TAG,
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
