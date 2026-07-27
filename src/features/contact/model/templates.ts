/**
 * Resend template aliases and the values baked into them at render time.
 *
 * Imported by both the runtime (which sends `template: { id, variables }`) and
 * `scripts/sync-email-templates.tsx` (which uploads them), so the name used at
 * upload time and the name used at send time cannot drift.
 *
 * NOTE: this module — and everything else in `model/` — must stay free of `@/*`
 * imports. The sync script runs under tsx, which does not resolve the alias.
 * That is why SITE_URL is inlined here rather than read from `@/shared/site`;
 * keep the two in step.
 */

export const CONTACT_NOTIFICATION_TEMPLATE = "contact-notification";
export const CONTACT_AUTO_REPLY_TEMPLATE = "contact-auto-reply";

export const OWNER_NAME = "Abdalla";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://abdalla.futuresolve.net";
