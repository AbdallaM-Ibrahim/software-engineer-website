import type { Metadata } from "next";

import { ServicesIndexPage } from "@/components/pages/services-index-page";
import { buildServicesIndexMetadata } from "@/lib/metadata";
import { isDraftMode } from "@/lib/draft";

// Dynamic, with data served from the cache — see the English home page.
export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return buildServicesIndexMetadata("ar");
}

export default async function ArabicServices() {
  return <ServicesIndexPage locale="ar" draft={await isDraftMode()} />;
}
