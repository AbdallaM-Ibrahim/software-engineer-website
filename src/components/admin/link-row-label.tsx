"use client";

import { useRowLabel } from "@payloadcms/ui";

import { SocialIcon } from "@/components/social-icon";
import { handleFrom, socialLabel } from "@/lib/social";

type LinkRow = {
  platform?: string | null;
  label?: string | null;
  url?: string | null;
};

/**
 * Collapsed-row summary for Profile → contact → links.
 *
 * The default label is "Link 01", which makes a collapsed list of links
 * unreadable. This shows the platform glyph, its name, and the tail of the URL,
 * so a row can be identified without opening it.
 */
export function LinkRowLabel() {
  const { data, rowNumber } = useRowLabel<LinkRow>();

  const name = socialLabel(data?.platform, data?.label);
  const url = data?.url ? handleFrom(data.url) : null;

  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
    >
      {/* Sized inline: the admin bundle has no Tailwind, and a bare SVG with no
          width collapses to its intrinsic size (here, far too large). */}
      <SocialIcon
        platform={data?.platform}
        style={{ width: 16, height: 16, flexShrink: 0 }}
      />
      <strong>{name}</strong>
      {url ? (
        <span style={{ opacity: 0.6, fontSize: "0.85em" }}>{url}</span>
      ) : (
        <span style={{ opacity: 0.5, fontSize: "0.85em" }}>
          row {String((rowNumber ?? 0) + 1).padStart(2, "0")} — no URL yet
        </span>
      )}
    </span>
  );
}

export default LinkRowLabel;
