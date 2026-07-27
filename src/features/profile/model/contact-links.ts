import { socialLabel, whatsappLink, whatsappNumberFromUrl } from "./social";
import type { Profile } from "./types";

export type ContactLink = {
  id: string;
  platform: string;
  label: string;
  url: string;
};

export type WhatsappInfo = {
  /** The wa.me chat URL. */
  url: string;
  /** Display number, when known. */
  number: string | null;
  /**
   * True when the WhatsApp number is the phone number itself. The Contact
   * section merges that case into the phone card rather than showing a second
   * card for the same number.
   */
  fromPhone: boolean;
};

/**
 * The WhatsApp chat details, or null when there isn't one.
 *
 * Source depends on the `phoneIsWhatsapp` switch: ticked, the phone number is
 * the WhatsApp number (`fromPhone`); unticked, the separate field is used — and
 * that field stores null when blank, so "no WhatsApp" is representable rather
 * than implied by an empty string.
 *
 * An explicit `whatsapp` platform link in the links array wins over both: if an
 * editor pasted a wa.me URL by hand, that is the more deliberate answer, and it
 * is treated as a distinct number (its own card).
 */
export function resolveWhatsappInfo(profile: Profile): WhatsappInfo | null {
  const contact = profile.contact ?? {};

  const explicit = (contact.links ?? []).find(
    (link) => link.platform === "whatsapp" && link.url,
  );
  if (explicit?.url) {
    return {
      url: explicit.url,
      number: whatsappNumberFromUrl(explicit.url),
      fromPhone: false,
    };
  }

  const fromPhone = Boolean(contact.phoneIsWhatsapp);
  const number = fromPhone ? contact.phone : contact.whatsapp;
  const url = whatsappLink(number);
  if (!url) return null;
  return { url, number: number ?? null, fromPhone };
}

/** The WhatsApp chat URL, or null when there isn't one. */
export function resolveWhatsapp(profile: Profile): string | null {
  return resolveWhatsappInfo(profile)?.url ?? null;
}

/**
 * Contact links in display order, normalised so every entry has a usable label.
 * Entries without a URL are dropped — an editor mid-edit shouldn't render a
 * dead anchor.
 */
export function contactLinks(profile: Profile): ContactLink[] {
  return (profile.contact?.links ?? [])
    .filter((link) => Boolean(link.url))
    .map((link, index) => ({
      id: link.id ?? String(index),
      platform: link.platform ?? "other",
      label: socialLabel(link.platform, link.label),
      url: link.url as string,
    }));
}

/** The first link on a given platform, e.g. the LinkedIn profile for the hero. */
export function findLink(
  profile: Profile,
  platform: string,
): ContactLink | undefined {
  return contactLinks(profile).find((link) => link.platform === platform);
}
