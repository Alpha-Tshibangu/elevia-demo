"use client"
import { DataSourceCard } from "@/components/ui/pipeline/DataSourceCard"

interface DataSource {
  id: string
  name: string
  sourceType: string
  status: string
  recordsProcessed: number
  dataQuality: number
  lastSync: Date | null
  nextSync: Date | null
  errorMessage: string | null
  iconUrl: string | null
}

interface PipelineClientProps {
  sources: DataSource[]
}

export function PipelineClient({ sources }: PipelineClientProps) {
  return (
    <section aria-labelledby="source-status" className="mt-16">
      <h2
        id="source-status"
        className="scroll-mt-8 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
      >
        Source Status
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {sources.map((source) => (
          <DataSourceCard key={source.id} source={source} />
        ))}
      </div>
    </section>
  )
}