"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

// Route-group error boundary. The page reads MongoDB at request time, so an
// outage or a bad query surfaces here instead of a blank framework error page.
export default function FrontendError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          The site couldn&apos;t load its content. This is usually a temporary
          database connection problem.
        </p>
        {error.digest ? (
          <p className="text-muted-foreground font-mono text-xs">
            Reference: {error.digest}
          </p>
        ) : null}
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}
