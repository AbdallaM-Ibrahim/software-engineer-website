import { SITE_URL } from "@/lib/site";
import type { Media } from "@/payload-types";

/**
 * Payload upload fields come back either populated or as a bare id, depending
 * on the query depth. Everything that renders or links to an image goes through
 * these so the two shapes are handled in one place.
 */
export type MediaValue = number | string | Media | null | undefined;

export function asMedia(value: MediaValue): Media | null {
  return value && typeof value === "object" ? value : null;
}

/**
 * Absolute URL for an uploaded image.
 *
 * Structured data and OG tags are read by machines that do not resolve relative
 * paths against the page they were found on, so these must be absolute even
 * though the site itself would be fine with `/media/x.jpg`.
 */
export function mediaUrl(value: MediaValue): string | null {
  const media = asMedia(value);
  if (!media?.url) return null;
  return media.url.startsWith("http") ? media.url : `${SITE_URL}${media.url}`;
}

export function mediaAlt(value: MediaValue, fallback = ""): string {
  return asMedia(value)?.alt ?? fallback;
}

/** Intrinsic dimensions, when Payload recorded them. Used to prevent layout shift. */
export function mediaSize(value: MediaValue) {
  const media = asMedia(value);
  if (!media?.width || !media?.height) return null;
  return { width: media.width, height: media.height };
}
