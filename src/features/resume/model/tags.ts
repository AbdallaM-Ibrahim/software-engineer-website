/**
 * Cache tags for the CV collections.
 *
 * Each is imported by both its collection's revalidate hook and the reader
 * that caches under it, so a rename cannot leave the two disagreeing.
 *
 * No `@/*` imports: these are reachable from the Payload config, which the CLI
 * loads through tsx.
 */
export const SKILLS_TAG = "skills";
export const EXPERIENCE_TAG = "experience";
export const EDUCATION_TAG = "education";
