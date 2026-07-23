import type { Metadata } from "next";

import { HomePage } from "@/components/pages/home-page";
import { buildHomeMetadata } from "@/lib/metadata";
import { isDraftMode } from "@/lib/draft";

// Rendered per request, but the DB reads come from the tagged data cache
// (src/lib/data.ts), so a visit costs no database round-trip once warm. Dynamic
// rather than statically prerendered on purpose: the build container can't be
// relied on to reach the database (it usually can't on Vercel), and a static
// prerender there would bake the EmptyState into the page for good.
export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return buildHomeMetadata("en");
}

export default async function Home() {
  return <HomePage locale="en" draft={await isDraftMode()} />;
}
