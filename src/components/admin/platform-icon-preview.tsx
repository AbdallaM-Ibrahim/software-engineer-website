"use client";

import { useFormFields } from "@payloadcms/ui";

import { SocialIcon } from "@/components/social-icon";
import { socialLabel } from "@/lib/social";

/**
 * Live glyph preview sitting beside the platform select, so an editor can see
 * which icon a choice produces without saving and reloading the site.
 *
 * Payload passes this UI field its own `path` (e.g.
 * `contact.links.0.platformPreview`). Swapping the last segment gives the
 * sibling select's path, which is how the preview follows the right row.
 */
export function PlatformIconPreview({ path }: { path?: string }) {
  const platformPath = path
    ? path.replace(/[^.]+$/, "platform")
    : "contact.links.0.platform";

  const platform = useFormFields(
    ([fields]) => fields?.[platformPath]?.value as string | undefined,
  );

  return (
    <div className="field-type">
      {/* Not a <label>: it names a read-only swatch, not a form control. */}
      <div className="field-label">Preview</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          height: "38px",
          padding: "0 0.75rem",
          border: "1px solid var(--theme-elevation-150)",
          borderRadius: "var(--style-radius-s, 4px)",
          background: "var(--theme-elevation-50)",
        }}
        title={socialLabel(platform)}
      >
        <SocialIcon platform={platform} style={{ width: 18, height: 18 }} />
      </div>
    </div>
  );
}

export default PlatformIconPreview;
