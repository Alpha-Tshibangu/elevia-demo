import { PageHeaderSkeleton, ChartSkeleton } from './PageSkeleton'

export function BloombergDataSkeleton() {
  return (
    <div className="mb-8">
      <div className="animate-pulse flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="text-center">
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
              <div className="h-6 w-12 bg-gray-200 dark:bg-gray-800 rounded mx-auto mb-1"></div>
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="animate-pulse text-center">
        <div className="h-3 w-96 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
      </div>
    </div>
  )
}

export function ScenarioCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded mb-1"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
              <div>
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-1"></div>
                <div className="h-6 w-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-1"></div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
              <div>
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-1"></div>
                <div className="h-6 w-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            </div>
          </div>
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ModelsSkeleton() {
  return (
    <>
      <PageHeaderSkeleton />

      <div className="mt-8">
        <BloombergDataSkeleton />
      </div>

      <section className="mt-8">
        <div className="animate-pulse mb-6">
          <div className="h-7 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>

        <ScenarioCardsSkeleton />
      </section>

      <section className="mt-12">
        <div className="animate-pulse mb-6">
          <div className="h-7 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
          <div className="h-4 w-56 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>

        <ChartSkeleton />
      </section>
    </>
  )
}