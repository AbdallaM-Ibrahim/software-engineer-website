import type { Metadata } from "next";

import { ServicesIndexPage } from "@/components/pages/services-index-page";
import { buildServicesIndexMetadata } from "@/lib/metadata";
import { isDraftMode } from "@/lib/draft";

// Dynamic, with data served from the cache — see the home page for why.
export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return buildServicesIndexMetadata("en");
}

export default async function Services() {
  return <ServicesIndexPage locale="en" draft={await isDraftMode()} />;
}
