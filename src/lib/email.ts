import { Resend } from "resend";

// Template aliases. Imported by both the sync script and the route handler so
// the name used at upload time and the name used at send time cannot drift.
export const CONTACT_NOTIFICATION_TEMPLATE = "contact-notification";
export const CONTACT_AUTO_REPLY_TEMPLATE = "contact-auto-reply";

// Same resolution as src/app/(frontend)/sitemap.ts — keep the two in step.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://abdalla.futuresolve.net";

export const OWNER_NAME = "Abdalla";

// Last-resort recipient. Also the only address the Resend sandbox sender
// (onboarding@resend.dev) is allowed to deliver to until a domain is verified.
const FALLBACK_TO_EMAIL = "abdalla.mostafa19200@gmail.com";

// Two keys with different scopes, so the runtime never holds more privilege
// than it needs:
//   RESEND_API_KEY_SEND — sending-only, used by the contact route.
//   RESEND_API_KEY      — full access, used only by scripts/sync-email-templates.
// A sending-only key returns 401 restricted_api_key on /templates, and a
// full-access key sitting in the request path is privilege the route never uses.
const clients = new Map<string, Resend>();

function clientFor(apiKey: string): Resend {
  let existing = clients.get(apiKey);
  if (!existing) {
    existing = new Resend(apiKey);
    clients.set(apiKey, existing);
  }
  return existing;
}

/** Sending-scoped client for the request path. */
export function getSendingResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY_SEND ?? process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY_SEND (or RESEND_API_KEY) is not set — cannot send email.",
    );
  }
  return clientFor(apiKey);
}

/** Full-access client. Template CRUD only — never use this to serve a request. */
export function getManagementResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not set — template sync needs a full-access key.",
    );
  }
  return clientFor(apiKey);
}

/** The `from` header. Sandbox default only delivers to the account owner. */
export function getFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL ?? "Abdalla Mostafa <onboarding@resend.dev>"
  );
}

/** Auto-reply to the visitor. Off by default — it 403s without a verified domain. */
export function autoReplyEnabled(): boolean {
  return process.env.CONTACT_AUTO_REPLY === "true";
}

/**
 * Destination for contact submissions: env, then the Payload Profile global,
 * then a hardcoded address. `getProfile()` already swallows DB failures and
 * returns null, so an unreachable Mongo degrades to the fallback rather than
 * dropping the message.
 *
 * The Payload lookup is a dynamic import on purpose: it drags in Mongo and the
 * whole Payload config, and scripts/sync-email-templates.tsx imports this module
 * for the alias constants alone. A static import would make the sync script boot
 * a database connection it has no use for.
 */
export async function resolveRecipient(): Promise<string> {
  const fromEnv = process.env.CONTACT_TO_EMAIL?.trim();
  if (fromEnv) return fromEnv;

  try {
    const { getProfile } = await import("@/lib/data");
    const profile = await getProfile();
    const fromProfile = profile?.contact?.email?.trim();
    if (fromProfile) return fromProfile;
  } catch {
    // Payload unavailable — fall through to the hardcoded address.
  }

  return FALLBACK_TO_EMAIL;
}

/**
 * Resend templates interpolate with TRIPLE mustache, which substitutes the raw
 * value into the HTML without escaping. Visitor-supplied text therefore has to
 * be escaped here or a submitted `<script>`/`<a>` becomes live markup in the
 * recipient's inbox.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escape, then turn newlines into <br />. Explicit breaks beat
 * `white-space: pre-wrap`, which Outlook renders inconsistently.
 */
export function toHtmlParagraph(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}
