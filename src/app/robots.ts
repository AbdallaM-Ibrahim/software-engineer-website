import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

// AI assistants increasingly answer "who should I hire for X" directly, and the
// whole point of this site is being found. So the crawlers behind those answers
// are allowed explicitly rather than left to a default — GPTBot and friends
// read the site, and Google-Extended lets Gemini and AI Overviews use it.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

// The CMS and its API carry no content worth indexing. Both also send
// `X-Robots-Tag: noindex` (see next.config.ts) — robots.txt only asks crawlers
// not to fetch a URL, it does not stop one that was linked from being indexed.
const DISALLOW = ["/admin", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
