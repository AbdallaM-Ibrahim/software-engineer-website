import type { Metadata } from "next";

import { HomePage } from "@/components/pages/home-page";
import { buildHomeMetadata } from "@/lib/metadata";
import { isDraftMode } from "@/lib/draft";

// Dynamic, with data served from the cache — see the English home page.
export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return buildHomeMetadata("ar");
}

export default async function ArabicHome() {
  return <HomePage locale="ar" draft={await isDraftMode()} />;
}
