import { draftMode } from "next/headers";

/**
 * Whether the current request is the admin panel's live-preview iframe.
 *
 * When true, the data layer bypasses the cache and reads drafts, so an editor
 * sees unpublished changes as they type. For everyone else this is false and
 * reads come from the tagged cache.
 *
 * Wrapped because the metadata routes (sitemap, robots) and the Payload CLI
 * call the same data helpers outside a request scope, where `draftMode()`
 * throws — there, there is simply no draft.
 */
export async function isDraftMode(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}
