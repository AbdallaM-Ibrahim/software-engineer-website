import { socialLabel, whatsappLink } from "@/lib/social";
import type { Profile } from "@/payload-types";

export type ContactLink = {
  id: string;
  platform: string;
  label: string;
  url: string;
};

/**
 * The WhatsApp chat URL, or null when there isn't one.
 *
 * Source depends on the `phoneIsWhatsapp` switch: ticked, the phone number is
 * the WhatsApp number; unticked, the separate field is used — and that field
 * stores null when blank, so "no WhatsApp" is representable rather than implied
 * by an empty string.
 *
 * An explicit `whatsapp` platform link in the links array wins over both: if an
 * editor pasted a wa.me URL by hand, that is the more deliberate answer.
 */
export function resolveWhatsapp(profile: Profile): string | null {
  const contact = profile.contact ?? {};

  const explicit = (contact.links ?? []).find(
    (link) => link.platform === "whatsapp" && link.url,
  );
  if (explicit?.url) return explicit.url;

  const number = contact.phoneIsWhatsapp ? contact.phone : contact.whatsapp;
  return whatsappLink(number);
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
