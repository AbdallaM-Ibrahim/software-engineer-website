// Templates render HTML server-side and the rate limiter keeps in-process
// state, so this must not be statically evaluated at build time.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// A cold start boots the whole Payload config (recipient lookup) before two
// Resend round-trips, which can brush past the 10s default. Route segment
// config, not a vercel.json functions glob — the App Router way, and it can't
// fail the build on a path mismatch.
export const maxDuration = 30;

// The handler itself lives in the contact feature. Only the segment config
// stays here: Next reads those exports statically, so they cannot be
// re-exported from another module.
export { POST } from "@/features/contact/server";
