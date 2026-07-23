"use client";

import { RefreshRouteOnSave as PayloadRefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";

/**
 * Live preview bridge.
 *
 * The site renders as server components reading Payload directly, so there is
 * no client-side document to patch — the correct refresh strategy is to
 * re-run the server render. This listens for the admin panel's postMessage on
 * save and calls router.refresh(), which refetches the RSC payload in place
 * without a full reload or losing scroll position.
 *
 * Renders nothing. Outside the preview iframe it never fires.
 */
export function RefreshOnSave({ serverURL }: { serverURL: string }) {
  const router = useRouter();

  return (
    <PayloadRefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={serverURL}
    />
  );
}
