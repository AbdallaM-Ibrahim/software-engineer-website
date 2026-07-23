import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

// Same origin as src/lib/site.ts. Inlined because next.config runs before the
// module aliases are available.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://abdalla.futuresolve.net"
).replace(/\/+$/, "");

const canonicalHost = (() => {
  try {
    return new URL(SITE_URL).host;
  } catch {
    return "";
  }
})();

// Serving the same page on both www and the apex indexes it twice and splits
// ranking between them. Redirect whichever host is not canonical. Skipped on
// localhost, where there is no www variant to collide with.
const hostRedirects = (() => {
  if (!canonicalHost || canonicalHost.startsWith("localhost")) return [];
  const isWww = canonicalHost.startsWith("www.");
  const otherHost = isWww ? canonicalHost.slice(4) : `www.${canonicalHost}`;
  return [
    {
      source: "/:path*",
      has: [{ type: "host" as const, value: otherHost }],
      destination: `${SITE_URL}/:path*`,
      permanent: true,
    },
  ];
})();

// Uploads live on local disk until an S3-compatible bucket is configured, at
// which point Payload serves them from the bucket's public host instead. That
// host has to be declared for next/image to touch it, and it is not derivable
// from the S3 credentials — R2 in particular serves from a separate r2.dev
// subdomain or a custom domain.
const mediaHost = (() => {
  const raw = process.env.NEXT_PUBLIC_MEDIA_URL;
  if (!raw) return [];
  try {
    const url = new URL(raw);
    return [
      {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        pathname: "/**",
      },
    ];
  } catch {
    return [];
  }
})();

const nextConfig: NextConfig = {
  // Payload uses server components + native deps; keep the defaults minimal.

  images: {
    remotePatterns: mediaHost,
    // AVIF first: roughly 20% smaller than WebP on photographic screenshots,
    // which is what every image on this site is.
    formats: ["image/avif", "image/webp"],
  },

  // Next's default, set explicitly: /services/x and /services/x/ must not both
  // resolve, or they are two URLs with one page behind them.
  trailingSlash: false,

  async redirects() {
    return hostRedirects;
  },

  async headers() {
    return [
      {
        // robots.txt asks crawlers not to fetch these; the header is what stops
        // them being indexed if something links to one anyway.
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
