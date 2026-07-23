// Shown when the database has no profile document — a fresh clone before
// `pnpm seed`, or an unreachable Mongo. Extracted from the old page.tsx so both
// locale routes and the services routes can render the same fallback.
export function EmptyState() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-2xl font-bold">No content yet</h1>
        <p className="text-muted-foreground">
          The database has no profile data. Run the seed script to import your
          portfolio, then reload:
        </p>
        <pre className="bg-muted rounded-md p-3 text-start text-sm">
          pnpm seed
        </pre>
        <p className="text-muted-foreground text-sm">
          Or add content manually in the{" "}
          {/* Hard link — /admin is served by the Payload route group, not a Next page. */}
          <a href="/admin" className="text-primary hover:underline">
            admin panel
          </a>
          .
        </p>
      </div>
    </main>
  );
}
