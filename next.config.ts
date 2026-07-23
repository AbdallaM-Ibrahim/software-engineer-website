import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  // Payload uses server components + native deps; keep the defaults minimal.
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
