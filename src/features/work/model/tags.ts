/**
 * Cache tags for the proof collections.
 *
 * Each is imported by both its collection's revalidate hook and the reader
 * that caches under it, so a rename cannot leave the two disagreeing.
 *
 * No `@/*` imports: these are reachable from the Payload config, which the CLI
 * loads through tsx.
 */
export const CASE_STUDIES_TAG = "case-studies";
export const TESTIMONIALS_TAG = "testimonials";
