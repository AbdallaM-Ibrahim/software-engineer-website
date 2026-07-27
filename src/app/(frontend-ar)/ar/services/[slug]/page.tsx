import type { Metadata } from "next";

import { ServicePage } from "@/views/service-detail/service-page";
import { buildServiceMetadata } from "@/features/seo/server";
import { isDraftMode } from "@/shared/cms/draft";

// Rendered on demand, with data from the cache — see the English home page.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildServiceMetadata(slug, "ar");
}

export default async function ArabicService({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ServicePage slug={slug} locale="ar" draft={await isDraftMode()} />;
}
