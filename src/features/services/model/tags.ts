/**
 * The cache tag for services.
 *
 * Imported by both the collection's revalidate hook and the readers that cache
 * under it, so the write side and the read side cannot drift.
 *
 * No `@/*` imports: reachable from the Payload config, which the CLI loads
 * through tsx.
 */
export const SERVICES_TAG = "services";
