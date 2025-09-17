import { TableSkeleton } from './PageSkeleton'

export function DealMetricsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6 text-center">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded mx-auto mb-2"></div>
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded mx-auto mb-1"></div>
          <div className="h-3 w-12 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
        </div>
      ))}
    </div>
  )
}

export function DueDiligenceTrackerSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              <div>
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-1"></div>
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            </div>
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TransactionsSkeleton() {
  return (
    <>
      <section aria-label="Loading transaction readiness">
        <div className="animate-pulse">
          <div className="h-7 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>

        <div className="mt-8">
          <DealMetricsSkeleton />
        </div>
      </section>

      <section className="mt-12">
        <div className="animate-pulse mb-6">
          <div className="h-7 w-52 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
        <DueDiligenceTrackerSkeleton />
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <div className="animate-pulse">
            <div className="h-7 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-10 w-36 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </div>
        </div>
        <TableSkeleton rows={5} />
      </section>
    </>
  )
}