import { TableSkeleton, KPISkeleton } from './PageSkeleton'

export function ReportCardSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div>
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-1"></div>
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
    </div>
  )
}

export function ReportsSkeleton() {
  return (
    <>
      <section aria-label="Loading reports overview">
        <div className="animate-pulse">
          <div className="h-7 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>

        <div className="mt-8">
          <KPISkeleton />
        </div>
      </section>

      <section className="mt-12">
        <div className="animate-pulse mb-6">
          <div className="h-7 w-40 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ReportCardSkeleton />
          <ReportCardSkeleton />
          <ReportCardSkeleton />
          <ReportCardSkeleton />
        </div>
      </section>

      <section className="mt-12">
        <div className="animate-pulse mb-6">
          <div className="h-7 w-44 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
        <TableSkeleton rows={8} />
      </section>
    </>
  )
}