import type { Metadata } from "next";

import { ServicePage } from "@/components/pages/service-page";
import { buildServiceMetadata } from "@/lib/metadata";
import { isDraftMode } from "@/lib/draft";

// Rendered on demand, with data from the cache. No generateStaticParams: that
// would prebuild every slug at build time, which needs a database the build
// container can't be relied on to reach (see the home page).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildServiceMetadata(slug, "en");
}

export default async function Service({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ServicePage slug={slug} locale="en" draft={await isDraftMode()} />;
}
