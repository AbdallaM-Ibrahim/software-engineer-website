/**
 * Contact-link platforms.
 *
 * Shared by the Payload schema (src/globals/Profile.ts) and the frontend, so the
 * option list an editor picks from and the icon map that renders it can't drift.
 *
 * NOTE: Profile.ts imports this with a relative path, not `@/lib/social` — the
 * Payload CLI loads the config through tsx, which does not resolve the `@/*`
 * tsconfig alias.
 */

export const SOCIAL_PLATFORMS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "x", label: "X (Twitter)" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "telegram", label: "Telegram" },
  { value: "stackoverflow", label: "Stack Overflow" },
  { value: "medium", label: "Medium" },
  { value: "website", label: "Website" },
  { value: "other", label: "Other — name it yourself" },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]["value"];

/** Options in the shape Payload's `select` field wants. */
export const SOCIAL_PLATFORM_OPTIONS = SOCIAL_PLATFORMS.map(
  ({ value, label }) => ({ value, label }),
);

const LABELS: Record<string, string> = Object.fromEntries(
  SOCIAL_PLATFORMS.map(({ value, label }) => [value, label]),
);

/**
 * Display name for a link: the editor's own text when the platform is "other"
 * (or anything unrecognised), otherwise the platform's canonical name.
 */
export function socialLabel(
  platform: string | null | undefined,
  custom?: string | null,
): string {
  const typed = custom?.trim();
  if (typed) return typed;
  return (platform && LABELS[platform]) || "Link";
}

/**
 * wa.me deep link from a phone number. WhatsApp wants digits only — no `+`,
 * spaces or dashes — so anything else is stripped.
 *
 * Returns null for empty or unusable input, which is what makes the WhatsApp
 * button disappear rather than render a dead link.
 */
export function whatsappLink(phone: string | null | undefined): string | null {
  const digits = (phone ?? "").replace(/\D/g, "");
  // Shortest plausible international number; below this it's a typo, not a number.
  if (digits.length < 7) return null;
  return `https://wa.me/${digits}`;
}

/** "https://linkedin.com/in/foo/" -> "in/foo" — the readable tail of a URL. */
export function handleFrom(url: string): string {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/^[^/]+\//, "")
    .replace(/\/$/, "");
}
