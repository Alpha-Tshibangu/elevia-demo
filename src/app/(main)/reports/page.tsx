'use client'

import { useState, useEffect } from 'react'
import { ReportCard } from "@/components/ui/reports/ReportCard"
import { KPIDashboard } from "@/components/ui/reports/KPIDashboard"
import { ReportsSkeleton } from "@/components/ui/skeletons/ReportsSkeleton"
import { getFinancialMetrics } from "@/lib/api-bridge"
import { getReports, getTransaction } from "@/lib/local-api"
import { PowerPointIcon, ExcelIcon, InvestorUpdateIcon } from "@/components/icons/DocumentIcons"
import { RiUploadCloud2Line, RiFolderOpenLine } from "@remixicon/react"
import { TransactionsClient } from "../transactions/TransactionsClient"

export default function Reports() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<{
    financialData: any
    reportData: any
    transaction: any
  } | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [financialData, reportData, transaction] = await Promise.all([
          getFinancialMetrics(),
          getReports(),
          getTransaction()
        ])

        setData({ financialData, reportData, transaction })
      } catch (error) {
        console.error('Error fetching report data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <ReportsSkeleton />
  }

  if (!data?.financialData || !data?.reportData) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Loading report data...</p>
      </div>
    )
  }

  const { financialData, reportData, transaction } = data

  // Transform financial data to KPI format
  const kpis = {
    revenue: {
      current: financialData.summary.totalRevenue,
      previous: financialData.metrics[financialData.metrics.length - 2]?.revenue || 0,
      change: financialData.summary.monthOverMonth,
    },
    ebitda: {
      current: financialData.summary.totalEbitda,
      previous: financialData.metrics[financialData.metrics.length - 2]?.ebitda || 0,
      change: financialData.summary.yearOverYear,
    },
    cashFlow: {
      current: financialData.summary.totalCashFlow,
      previous: financialData.metrics[financialData.metrics.length - 2]?.cashFlow || 0,
      change: financialData.summary.monthOverMonth,
    },
    dataQuality: {
      score: 95.2,
      sourcesActive: 12,
      totalSources: 15,
    },
  }

  // Get report icon based on type
  const getReportIcon = (type: string) => {
    switch (type) {
      case "board-deck":
        return PowerPointIcon // Use PowerPoint icon for board decks
      case "investor-update":
        return InvestorUpdateIcon // Use new investor update icon
      case "management-report":
      case "compliance-report":
        return ExcelIcon // Use Excel icon for reports
      default:
        return PowerPointIcon
    }
  }

  // Transform database reports to match UI interface
  const reportTemplates = (Array.isArray(reportData) ? [] : reportData.reports).map((report: any) => ({
    id: report.id,
    title: report.title,
    description: report.description || `${report.frequency} ${report.type.replace('-', ' ')} report`,
    lastGenerated: report.lastGenerated || new Date(),
    frequency: report.frequency || 'Monthly',
    icon: getReportIcon(report.type),
    status: (report.status === "draft" ? "scheduled" : report.status) as "ready" | "scheduled" | "overdue",
  }))

  return (
    <>
      <section aria-labelledby="reports-overview">
        <h1
          id="reports-overview"
          className="scroll-mt-10 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
        >
          Reports & Analytics
        </h1>
        
        <div className="mt-8">
          <KPIDashboard kpis={kpis} />
        </div>
      </section>

      <section aria-labelledby="board-reports" className="mt-12">
        <h2
          id="board-reports"
          className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
        >
          Report Templates
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {reportTemplates.map((report: any) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </section>

      <section aria-labelledby="data-room" className="mt-12">
        <div className="flex items-center justify-between">
          <h2
            id="data-room"
            className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
          >
            Data Room
          </h2>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800">
              <RiFolderOpenLine className="size-4" />
              Create Folder
            </button>
            <button className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
              <RiUploadCloud2Line className="size-4" />
              Upload Documents
            </button>
          </div>
        </div>

        <TransactionsClient documents={transaction?.documents} />
      </section>
    </>
  )
}