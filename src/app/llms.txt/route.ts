// A plain-text brief for the AI assistants that increasingly answer "who should
// I hire for X". Next reads these two statically, so they stay here; the body
// is generated from the CMS in the seo feature.
export const dynamic = "force-static";
export const revalidate = 3600;

export { llmsTxt as GET } from "@/features/seo/server";
