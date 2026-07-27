import "server-only";

import { Resend } from "resend";

/**
 * The sending-scoped Resend client for the request path.
 *
 * Two keys with different scopes, so the runtime never holds more privilege
 * than it needs:
 *   RESEND_API_KEY_SEND — sending-only, used here.
 *   RESEND_API_KEY      — full access, used only by the template sync script.
 *
 * The full-access client deliberately does not live in the app any more. It is
 * constructed inside `scripts/sync-email-templates.tsx`, the only thing that
 * needs it, so no request-path module can reach a key that may write templates.
 * (A sending-only key returns 401 restricted_api_key on /templates, which is
 * how the two used to get confused.)
 */
const clients = new Map<string, Resend>();

function clientFor(apiKey: string): Resend {
  let existing = clients.get(apiKey);
  if (!existing) {
    existing = new Resend(apiKey);
    clients.set(apiKey, existing);
  }
  return existing;
}

export function getSendingResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY_SEND ?? process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY_SEND (or RESEND_API_KEY) is not set — cannot send email.",
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
