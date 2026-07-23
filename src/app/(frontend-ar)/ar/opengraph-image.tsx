import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";

// On demand, not prerendered — see the English home opengraph-image.
export const dynamic = "force-dynamic";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Abdalla Mostafa — Senior Software Engineer";

// Arabic home shares the English branding card — the name and role are the same
// in both languages, and the card copy is Latin by design (see og.tsx).
export default function OpengraphImage() {
  return renderOgCard({
    title: "Abdalla Mostafa",
    subtitle:
      "Scalable web platforms, process automation, and payment integrations.",
  });
}
