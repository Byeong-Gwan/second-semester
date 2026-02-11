export default function Loading() {
  return (
    <div className="container max-w-6xl py-8">
      <div className="animate-pulse space-y-8">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-10 bg-muted rounded-lg w-64" />
          <div className="h-6 bg-muted rounded-lg w-48" />
        </div>

        {/* Cards skeleton */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-40 bg-muted rounded-lg" />
          <div className="h-40 bg-muted rounded-lg" />
          <div className="h-40 bg-muted rounded-lg" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-64 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  )
}
