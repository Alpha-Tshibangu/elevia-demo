'use client'

import { useState, useEffect } from 'react'
import { PipelineMetricsCard } from "@/components/ui/pipeline/PipelineMetricsCard"
import { DataQualityCard } from "@/components/ui/pipeline/DataQualityCard"
import { PipelineClient } from "./PipelineClient"
import { PipelineSkeleton } from "@/components/ui/skeletons/PipelineSkeleton"
import { getDataSources } from "@/lib/api-bridge"

export default function Pipeline() {
  const [isLoading, setIsLoading] = useState(true)
  const [sources, setSources] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const dataSourceData = await getDataSources()
        const { sources: fetchedSources, summary: fetchedSummary } = Array.isArray(dataSourceData)
          ? { sources: [], summary: null }
          : dataSourceData

        setSources(fetchedSources)
        setSummary(fetchedSummary)
      } catch (error) {
        console.error('Error fetching pipeline data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <PipelineSkeleton />
  }

  if (!sources.length) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Loading pipeline data...</p>
      </div>
    )
  }

  const activeSourcesCount = summary?.activeSources || sources.filter(s => s.status === 'active').length
  const totalRecordsProcessed = summary?.totalRecords || sources.reduce((acc, s) => acc + s.recordsProcessed, 0)
  const avgDataQuality = summary?.averageQuality || (sources.reduce((acc, s) => acc + Number(s.dataQuality), 0) / sources.length)

  return (
    <>
      <section aria-labelledby="data-pipeline-overview">
        <h1
          id="data-pipeline-overview"
          className="scroll-mt-10 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
        >
          Data Pipeline Status
        </h1>
        <div className="mt-4 grid grid-cols-1 gap-14 sm:mt-8 sm:grid-cols-2 lg:mt-10 xl:grid-cols-3">
          <PipelineMetricsCard
            title="Data Sources"
            value={`${activeSourcesCount}/${sources.length}`}
            valueDescription="sources active"
            change="+2"
            changeDescription="vs last month"
            metrics={[
              { label: "API", value: sources.filter(s => s.sourceType === 'API').length },
              { label: "Excel", value: sources.filter(s => s.sourceType === 'Excel').length },
              { label: "Database", value: sources.filter(s => s.sourceType === 'Database').length },
            ]}
          />
          <PipelineMetricsCard
            title="Records Processed"
            value={`${(totalRecordsProcessed / 1000).toFixed(1)}K`}
            valueDescription="in last 24 hours"
            change="+3.4%"
            changeDescription="vs yesterday"
            metrics={[
              { label: "Financial", value: Math.floor(totalRecordsProcessed * 0.5) },
              { label: "Operational", value: Math.floor(totalRecordsProcessed * 0.3) },
              { label: "Commercial", value: Math.floor(totalRecordsProcessed * 0.2) },
            ]}
          />
          <DataQualityCard
            title="Data Quality"
            value={`${avgDataQuality.toFixed(1)}%`}
            valueDescription="average score"
            change={avgDataQuality > 90 ? `+${(avgDataQuality - 90).toFixed(1)}%` : `${(avgDataQuality - 90).toFixed(1)}%`}
            changeDescription="improvement"
            qualityMetrics={[
              { metric: "Completeness", score: Math.min(avgDataQuality + 5, 100), status: avgDataQuality > 85 ? "good" : "warning" },
              { metric: "Accuracy", score: avgDataQuality, status: avgDataQuality > 90 ? "good" : "warning" },
              { metric: "Timeliness", score: Math.max(avgDataQuality - 5, 80), status: avgDataQuality > 88 ? "good" : "warning" },
            ]}
          />
        </div>
      </section>
      
      <PipelineClient sources={sources} />
    </>
  )
}
