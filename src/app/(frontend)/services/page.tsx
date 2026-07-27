import type { Metadata } from "next";

import { ServicesIndexPage } from "@/views/services-index/services-index-page";
import { buildServicesIndexMetadata } from "@/features/seo/server";
import { isDraftMode } from "@/shared/cms/draft";

// Dynamic, with data served from the cache — see the home page for why.
export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return buildServicesIndexMetadata("en");
}

export default async function Services() {
  return <ServicesIndexPage locale="en" draft={await isDraftMode()} />;
}
