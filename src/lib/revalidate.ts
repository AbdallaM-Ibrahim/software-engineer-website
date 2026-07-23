/**
 * Cache invalidation for the CMS.
 *
 * The frontend reads through `unstable_cache` (see src/lib/data.ts), so a
 * document saved in /admin would otherwise not reach the live page until the
 * cache expired. These hooks flush the matching tag on write.
 *
 * `next/cache` is imported dynamically and the call is wrapped, because this
 * module is also pulled in by the Payload CLI (`pnpm generate:types`, `pnpm
 * seed`) where there is no Next server to talk to. Outside a request there is
 * nothing to invalidate, and failing to invalidate must never fail the write.
 */

export async function revalidate(...tags: string[]) {
  try {
    const { revalidateTag } = await import("next/cache");
    // `{ expire: 0 }` expires the tag immediately, so the next visit to any page
    // using it renders fresh rather than serving one more stale response — the
    // right trade for a CMS where the editor expects to see their save. Next 16
    // deprecated the one-argument form.
    for (const tag of tags) revalidateTag(tag, { expire: 0 });
  } catch {
    // Not running inside Next. Nothing is cached, so nothing to flush.
  }
}

/**
 * `hooks` block for a collection whose documents feed one cache tag.
 *
 * Every locale shares the tag: a save in Arabic must also flush English, since
 * `fallback: true` means the English document can be what an Arabic page is
 * currently rendering.
 */
export function revalidateHooks(tag: string) {
  const flush = () => {
    void revalidate(tag);
  };
  return {
    afterChange: [flush],
    afterDelete: [flush],
  };
}

/** Same, for globals — which have no `afterDelete`. */
export function revalidateGlobalHooks(tag: string) {
  return {
    afterChange: [
      () => {
        void revalidate(tag);
      },
    ],
  };
}
