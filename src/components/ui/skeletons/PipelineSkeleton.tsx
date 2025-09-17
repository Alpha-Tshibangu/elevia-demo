import { CardSkeleton, TableSkeleton } from './PageSkeleton'

export function PipelineSkeleton() {
  return (
    <>
      <section aria-label="Loading pipeline overview">
        <div className="animate-pulse">
          <div className="h-7 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-14 sm:mt-8 sm:grid-cols-2 lg:mt-10 xl:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </section>

      <section className="mt-12">
        <div className="animate-pulse mb-6">
          <div className="h-7 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
        <TableSkeleton rows={6} />
      </section>
    </>
  )
}