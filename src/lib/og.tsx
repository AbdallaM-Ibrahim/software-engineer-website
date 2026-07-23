import { ImageResponse } from "next/og";

// Shared renderer for the file-based opengraph-image routes. One card design,
// filled per page from CMS data, so a share of any URL renders something real
// instead of the blank card the site produced before.
//
// Uses the built-in ImageResponse font. Loading a webfont here would mean a
// network fetch at build time, which is a needless failure mode for a card
// that is essentially branding — so the copy passed in is expected to be Latin
// (the name and role are the same in both locales).

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function renderOgCard({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background: "linear-gradient(135deg, #0b0b0f 0%, #16161d 100%)",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "12px",
            background: "#6366f1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "26px",
            fontWeight: 700,
          }}
        >
          AM
        </div>
        <span style={{ fontSize: "26px", fontWeight: 600 }}>
          Abdalla Mostafa
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {eyebrow ? (
          <span
            style={{
              fontSize: "24px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#a1a1aa",
            }}
          >
            {eyebrow}
          </span>
        ) : null}
        <span style={{ fontSize: "68px", fontWeight: 700, lineHeight: 1.1 }}>
          {title}
        </span>
        {subtitle ? (
          <span
            style={{ fontSize: "30px", color: "#a1a1aa", maxWidth: "900px" }}
          >
            {subtitle}
          </span>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "24px",
          color: "#818cf8",
        }}
      >
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#6366f1",
          }}
        />
        Senior Software Engineer
      </div>
    </div>,
    OG_SIZE,
  );
}
