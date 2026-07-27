import "server-only";

// Last-resort recipient. Also the only address the Resend sandbox sender
// (onboarding@resend.dev) is allowed to deliver to until a domain is verified.
const FALLBACK_TO_EMAIL = "abdalla.mostafa19200@gmail.com";

/**
 * Destination for contact submissions: env, then the Payload Profile global,
 * then a hardcoded address. `getProfile()` already swallows DB failures and
 * returns null, so an unreachable Mongo degrades to the fallback rather than
 * dropping the message.
 *
 * The Payload lookup stays a dynamic import: it drags in Mongo and the whole
 * Payload config, and this module is reached from a route that would otherwise
 * pay for that on every cold start even when CONTACT_TO_EMAIL is set.
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
