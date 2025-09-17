export function PageHeaderSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="mt-2 h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6 ${className}`}>
      <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
      <div className="h-10 w-20 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
    </div>
  )
}

export function ChartSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6 ${className}`}>
      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
      <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-6 flex items-center space-x-4">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            </div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function KPISkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function OverviewSkeleton() {
  return (
    <>
      <section aria-label="Loading overview">
        <PageHeaderSkeleton />
        <div className="mt-8">
          <KPISkeleton />
        </div>
      </section>

      <section className="mt-12">
        <div className="animate-pulse">
          <div className="h-7 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </section>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <section>
          <div className="animate-pulse mb-6">
            <div className="h-7 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
          <CardSkeleton />
        </section>
        <section>
          <div className="animate-pulse mb-6">
            <div className="h-7 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
          <CardSkeleton />
        </section>
      </div>
    </>
  )
}