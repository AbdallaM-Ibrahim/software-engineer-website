// Streaming fallback while the request-time Payload reads resolve.
export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-32 sm:px-6 lg:px-8">
      <div className="grid animate-pulse items-center gap-12 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="bg-muted h-4 w-40 rounded" />
          <div className="bg-muted h-12 w-full max-w-lg rounded" />
          <div className="bg-muted h-4 w-full max-w-md rounded" />
          <div className="bg-muted h-4 w-3/4 max-w-md rounded" />
          <div className="flex gap-3 pt-3">
            <div className="bg-muted h-11 w-36 rounded-md" />
            <div className="bg-muted h-11 w-36 rounded-md" />
          </div>
        </div>
        <div className="bg-muted mx-auto aspect-square w-64 rounded-full sm:w-80 lg:w-96" />
      </div>
      <span className="sr-only">Loading portfolio…</span>
    </main>
  );
}
