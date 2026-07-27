import type { Field } from "payload";

/**
 * Gate on indexing the Arabic version of whatever this document renders.
 *
 * Payload is configured with `fallback: true`, so an untranslated Arabic field
 * quietly renders its English value. That is the right behaviour for a human
 * reading the page and the wrong one for Google, which would index English prose
 * as Arabic content. Until this is ticked the /ar page still renders — so it can
 * be proofread in place — but emits `noindex` and stays out of the sitemap and
 * the hreflang set.
 *
 * Deliberately not localized: it is one editorial decision about the document,
 * not a value that differs per locale.
 */
export const translationReviewed: Field = {
  name: "translationReviewed",
  type: "checkbox",
  label: "Arabic translation reviewed",
  defaultValue: false,
  admin: {
    position: "sidebar",
    description:
      "Until this is ticked, the Arabic page renders but is not indexed.",
  },
};
