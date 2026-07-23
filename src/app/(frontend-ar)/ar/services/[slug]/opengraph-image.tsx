import { getServiceBySlug } from "@/lib/data";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";

// Generated per request from CMS data, not prerendered — see the home card.
export const dynamic = "force-dynamic";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Service — Abdalla Mostafa";

// Reads the English title so the card renders with the built-in Latin font.
export default async function ServiceOpengraphImage({
  params,
}: {
  params: { slug: string };
}) {
  const service = await getServiceBySlug(params.slug, "en");
  return renderOgCard({
    eyebrow: "Services",
    title: service?.title ?? "Services",
    subtitle: service?.teaser ?? service?.description ?? undefined,
  });
}
