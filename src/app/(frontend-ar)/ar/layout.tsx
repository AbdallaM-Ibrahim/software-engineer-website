import type { Metadata } from "next";
import "../../(frontend)/globals.css";

import { RootHtml } from "@/components/root-html";
import { baseMetadata } from "@/lib/metadata";

// Root layout for the Arabic site at /ar. A separate route group from the
// English one because it renders a different <html> — lang="ar", dir="rtl" —
// and that element belongs to a root layout, of which there can be one per
// group. Shares the stylesheet and the <RootHtml> body with English.
export const metadata: Metadata = baseMetadata("ar");

export default function ArabicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootHtml locale="ar">{children}</RootHtml>;
}
