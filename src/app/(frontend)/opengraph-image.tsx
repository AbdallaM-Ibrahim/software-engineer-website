import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";

// Rendered on demand rather than prerendered at build. The card is cheap to
// generate and this keeps the raster pipeline off the build machine, whose
// sharp/libvips build rejects the satori output.
export const dynamic = "force-dynamic";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Abdalla Mostafa — Senior Software Engineer";

// Home card. Branding is fixed; the tagline is Latin on purpose (see og.tsx),
// so the same card serves both locales.
export default function OpengraphImage() {
  return renderOgCard({
    title: "Abdalla Mostafa",
    subtitle:
      "Scalable web platforms, process automation, and payment integrations.",
  });
}
