// Streaming fallback while the request-time Payload reads resolve. Mirrors the
// real Hero (src/components/sections/hero.tsx) box-for-box — same padding, grid,
// square photo, social row and metric strip — so the page does not shift when
// the content swaps in. Logical utilities (ms-*) flip for the Arabic (rtl)
// layout, so both locales share this one skeleton.
export function HeroSkeleton() {
  return (
    <main>
      <section className="px-4 pt-28 pb-14 sm:px-6 sm:pt-36 sm:pb-16 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              {/* mobile identity avatar (round, above the copy) */}
              <div className="bg-muted mb-6 aspect-square w-20 rounded-full lg:hidden" />
              {/* headline eyebrow */}
              <div className="bg-muted h-3.5 w-44 rounded" />
              {/* name */}
              <div className="mt-5 space-y-3">
                <div className="bg-muted h-12 w-4/5 rounded sm:h-14" />
                <div className="bg-muted h-12 w-3/5 rounded sm:h-14" />
              </div>
              {/* tagline */}
              <div className="mt-6 max-w-xl space-y-2.5">
                <div className="bg-muted h-4 w-full rounded" />
                <div className="bg-muted h-4 w-2/3 rounded" />
              </div>
              {/* CTAs + social icons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="bg-muted h-11 w-36 rounded-md" />
                <div className="bg-muted h-11 w-36 rounded-md" />
                <div className="bg-muted ms-1 size-9 rounded-md" />
                <div className="bg-muted size-9 rounded-md" />
              </div>
            </div>

            {/* desktop portrait — square, beside the copy at lg and up */}
            <div className="bg-muted hidden aspect-square w-64 rounded-2xl lg:block" />
          </div>

          {/* metric strip */}
          <div className="border-foreground/15 mt-14 grid border-t sm:mt-16 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="border-foreground/10 flex flex-col-reverse gap-2 border-b py-5 sm:border-b-0 sm:py-6"
              >
                <div className="bg-muted h-3 w-28 rounded" />
                <div className="bg-muted h-9 w-32 rounded sm:h-10" />
              </div>
            ))}
          </div>
        </div>
        <span className="sr-only">Loading…</span>
      </section>
    </main>
  );
}
