/**
 * The cache tag for the Profile global.
 *
 * Imported by both the global's revalidate hook and the reader that caches
 * under it, so the write side and the read side cannot drift. They used to be
 * two independent string literals, where a typo in either silently stopped the
 * live page updating on save.
 *
 * No `@/*` imports here: this module is reachable from the Payload config,
 * which the CLI loads through tsx.
 */
export const PROFILE_TAG = "profile";
