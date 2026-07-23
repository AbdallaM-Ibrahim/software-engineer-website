import type { Metadata } from "next";
import "./globals.css";

import { RootHtml } from "@/components/root-html";
import { baseMetadata } from "@/lib/metadata";

// Root layout for the English site, served at the origin. The Arabic site is a
// second route group at /ar with its own root layout — two are required because
// `lang` and `dir` live on the server-rendered <html>, which only a root layout
// controls. The shared body is in <RootHtml>.
export const metadata: Metadata = baseMetadata("en");

export default function EnglishLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootHtml locale="en">{children}</RootHtml>;
}
