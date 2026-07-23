import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

// A 404 that returns 200-looking content is a soft 404 in Search Console. Next
// sends the right status; this adds the meta robots directive so a crawler that
// followed a dead link doesn't index the page it landed on.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div className="max-w-md space-y-4">
        <p className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
          404
        </p>
        <h1 className="font-display text-3xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          That page doesn&apos;t exist — it may have moved or never been here.
        </p>
        <Button asChild>
          <Link href="/">Back to the home page</Link>
        </Button>
      </div>
    </main>
  );
}
