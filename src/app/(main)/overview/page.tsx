'use client'

import { useState, useEffect } from 'react'
import { KPIDashboard } from "@/components/ui/reports/KPIDashboard"
import { PipelineMetricsCard } from "@/components/ui/pipeline/PipelineMetricsCard"
import { DataQualityCard } from "@/components/ui/pipeline/DataQualityCard"
import { RecentModelsCard } from "@/components/ui/overview/RecentModelsCard"
import { RecentReportsCard } from "@/components/ui/overview/RecentReportsCard"
import { OverviewSkeleton } from "@/components/ui/skeletons/PageSkeleton"
import {
  getFinancialMetrics,
  getDataSources,
  getModelScenarios
} from "@/lib/api-bridge"
import { getReports } from "@/lib/local-api"
import Link from "next/link"
import { RiArrowRightLine } from "@remixicon/react"

export default function Overview() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<{
    financialData: any
    dataSourceData: any
    scenarios: any
    reportData: any
  } | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all data in parallel
        const [financialData, dataSourceData, scenarios, reportData] = await Promise.all([
          getFinancialMetrics(),
          getDataSources(),
          getModelScenarios(),
          getReports()
        ])

        setData({ financialData, dataSourceData, scenarios, reportData })
      } catch (error) {
        console.error('Error fetching overview data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <OverviewSkeleton />
  }

  if (!data?.financialData || !data?.dataSourceData || (Array.isArray(data?.dataSourceData) && data?.dataSourceData.length === 0)) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Loading dashboard data...</p>
      </div>
    )
  }

  const { financialData, dataSourceData, scenarios, reportData } = data

  // Calculate pipeline metrics from actual data
  const { sources, summary } = Array.isArray(dataSourceData) ? { sources: [], summary: null } : dataSourceData
  const activeSourcesCount = summary?.activeSources || 0
  const totalSources = summary?.totalSources || sources.length
  const totalRecords = summary?.totalRecords || 0
  const avgQuality = summary?.averageQuality || 0

  // Transform financial metrics for KPI dashboard
  const kpis = {
    revenue: {
      current: Number(financialData.summary.totalRevenue),
      previous: Number(financialData.metrics[financialData.metrics.length - 2]?.revenue || 0),
      change: financialData.summary.monthOverMonth,
    },
    ebitda: {
      current: Number(financialData.summary.totalEbitda),
      previous: Number(financialData.metrics[financialData.metrics.length - 2]?.ebitda || 0),
      change: financialData.summary.yearOverYear,
    },
    cashFlow: {
      current: Number(financialData.summary.totalCashFlow),
      previous: Number(financialData.metrics[financialData.metrics.length - 2]?.cashFlow || 0),
      change: financialData.summary.monthOverMonth,
    },
    dataQuality: {
      score: avgQuality,
      sourcesActive: activeSourcesCount,
      totalSources: totalSources,
    },
  }

  // Group sources by type for metrics
  const sourcesByType = sources.reduce((acc: Record<string, number>, source: any) => {
    acc[source.sourceType] = (acc[source.sourceType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Calculate record distribution (mock for now, could be enhanced)
  const financialRecords = Math.floor(totalRecords * 0.5)
  const operationalRecords = Math.floor(totalRecords * 0.3)
  const commercialRecords = Math.floor(totalRecords * 0.2)

  return (
    <>
      <section aria-labelledby="overview-header">
        <div className="flex items-center justify-between">
          <div>
            <h1
              id="overview-header"
              className="scroll-mt-10 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
            >
              Overview
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your business performance at a glance
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <KPIDashboard kpis={kpis} />
        </div>
      </section>

      <section aria-labelledby="pipeline-summary" className="mt-12">
        <div className="flex items-center justify-between">
          <h2
            id="pipeline-summary"
            className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
          >
            Data Pipeline Status
          </h2>
          <Link
            href="/pipeline"
            className="inline-flex items-center gap-1 text-sm font-medium text-elevia-sapphire hover:text-elevia-indigo dark:text-elevia-azure"
          >
            View all sources
            <RiArrowRightLine className="size-4" />
          </Link>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <PipelineMetricsCard
            title="Data Sources"
            value={`${activeSourcesCount}/${totalSources}`}
            valueDescription="sources active"
            change={summary?.errorSources ? `-${summary.errorSources}` : "+0"}
            changeDescription={summary?.errorSources ? "errors detected" : "all healthy"}
            metrics={[
              { label: "API", value: sourcesByType['API'] || 0 },
              { label: "Excel", value: sourcesByType['Excel'] || 0 },
              { label: "Database", value: sourcesByType['Database'] || 0 },
            ]}
          />
          <PipelineMetricsCard
            title="Records Processed"
            value={`${(totalRecords / 1000).toFixed(1)}K`}
            valueDescription="total records"
            change="+2.3%"
            changeDescription="vs last sync"
            metrics={[
              { label: "Financial", value: financialRecords },
              { label: "Operational", value: operationalRecords },
              { label: "Commercial", value: commercialRecords },
            ]}
          />
          <DataQualityCard
            title="Data Quality"
            value={`${avgQuality.toFixed(1)}%`}
            valueDescription="average score"
            change={avgQuality > 90 ? `+${(avgQuality - 90).toFixed(1)}%` : `${(avgQuality - 90).toFixed(1)}%`}
            changeDescription={avgQuality > 90 ? "above threshold" : "needs attention"}
            qualityMetrics={[
              { metric: "Completeness", score: Math.min(avgQuality + 5, 100), status: avgQuality > 85 ? "good" : "warning" },
              { metric: "Accuracy", score: avgQuality, status: avgQuality > 90 ? "good" : "warning" },
              { metric: "Timeliness", score: Math.max(avgQuality - 5, 80), status: avgQuality > 88 ? "good" : "warning" },
            ]}
          />
        </div>
      </section>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <section aria-labelledby="recent-models">
          <div className="flex items-center justify-between">
            <h2
              id="recent-models"
              className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
            >
              Financial Models
            </h2>
            <Link
              href="/models"
              className="inline-flex items-center gap-1 text-sm font-medium text-elevia-sapphire hover:text-elevia-indigo dark:text-elevia-azure"
            >
              View models
              <RiArrowRightLine className="size-4" />
            </Link>
          </div>
          <div className="mt-6">
            <RecentModelsCard scenarios={scenarios} />
          </div>
        </section>

        <section aria-labelledby="recent-reports">
          <div className="flex items-center justify-between">
            <h2
              id="recent-reports"
              className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
            >
              Recent Reports
            </h2>
            <Link
              href="/reports"
              className="inline-flex items-center gap-1 text-sm font-medium text-elevia-sapphire hover:text-elevia-indigo dark:text-elevia-azure"
            >
              View reports
              <RiArrowRightLine className="size-4" />
            </Link>
          </div>
          <div className="mt-6">
            <RecentReportsCard reports={Array.isArray(reportData) ? [] : reportData.reports} />
          </div>
        </section>
      </div>
    </>
  )
}