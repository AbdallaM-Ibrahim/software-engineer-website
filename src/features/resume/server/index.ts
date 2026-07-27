import "server-only";

import { cachedRead } from "@/shared/cms/cached-read";
import { getPayloadClient } from "@/shared/cms/payload";
import { DEFAULT_LOCALE } from "@/shared/site";

import { EDUCATION_TAG, EXPERIENCE_TAG, SKILLS_TAG } from "../model/tags";

export const getSkills = cachedRead(
  SKILLS_TAG,
  SKILLS_TAG,
  [],
  async (locale) => {
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
  },
);

export const getExperience = cachedRead(
  EXPERIENCE_TAG,
  EXPERIENCE_TAG,
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
  EDUCATION_TAG,
  EDUCATION_TAG,
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
