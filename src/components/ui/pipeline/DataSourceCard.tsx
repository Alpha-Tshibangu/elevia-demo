import { cx } from "@/lib/utils"
import {
  RiRefreshLine,
  RiCheckLine,
  RiAlertLine,
  RiTimeLine,
  RiCodeLine,
  RiTableLine
} from "@remixicon/react"
import { DatabaseIcon, ExcelIcon, PdfIcon } from "@/components/icons/DocumentIcons"

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

interface DataSourceCardProps {
  source: DataSource
}

export function DataSourceCard({ source }: DataSourceCardProps) {

  // Static time strings to avoid hydration issues
  const getStaticTimeString = (sourceId: string, type: 'last' | 'next') => {
    const staticTimes = {
      '1': { last: '2 hours ago', next: 'in 4 hours' },
      '2': { last: '3 hours ago', next: 'in 3 hours' },
      '3': { last: '1 day ago', next: 'in 12 hours' },
      '4': { last: '6 hours ago', next: 'tomorrow' },
      '5': { last: '1 day ago', next: 'in 2 hours' },
    }
    return staticTimes[sourceId as keyof typeof staticTimes]?.[type] || 'Unknown'
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-transparent border border-emerald-700 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400"
      case "syncing":
        return "bg-transparent border border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-400"
      case "error":
        return "bg-transparent border border-red-700 text-red-700 dark:border-red-400 dark:text-red-400"
      case "inactive":
        return "bg-transparent border border-gray-700 text-gray-700 dark:border-gray-400 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <RiCheckLine className="size-4" />
      case "syncing":
        return <RiRefreshLine className="size-4 animate-spin" />
      case "error":
        return <RiAlertLine className="size-4" />
      case "inactive":
        return <RiTimeLine className="size-4" />
    }
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "API":
        return <RiCodeLine className="size-5" />
      case "Excel":
        return <ExcelIcon className="size-5" />
      case "Database":
        return <DatabaseIcon className="size-5" />
      case "CSV":
        return <RiTableLine className="size-5" />
      case "PDF":
        return <PdfIcon className="size-5" />
    }
  }

  const getQualityColor = (score: number) => {
    if (score >= 95) return "text-emerald-600 dark:text-emerald-500"
    if (score >= 90) return "text-blue-600 dark:text-blue-500"
    if (score >= 80) return "text-amber-600 dark:text-amber-500"
    return "text-red-600 dark:text-red-500"
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
            {getSourceIcon(source.sourceType)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-50">
              {source.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {source.sourceType} Connection
            </p>
          </div>
        </div>
        <span
          className={cx(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
            getStatusColor(source.status),
          )}
        >
          {getStatusIcon(source.status)}
          {source.status}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-500">
            Last Sync
          </p>
          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-50">
            {getStaticTimeString(source.id, 'last')}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-500">
            Next Sync
          </p>
          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-50">
            {getStaticTimeString(source.id, 'next')}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-500">
            Records
          </p>
          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-50">
            {source.recordsProcessed.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-500">
            Quality Score
          </p>
          <p className={cx("mt-1 text-sm font-semibold", getQualityColor(source.dataQuality))}>
            {source.dataQuality.toFixed(1)}%
          </p>
        </div>
      </div>

      {source.status === "error" && (
        <div className="mt-4 rounded-md bg-red-50 p-3 dark:bg-red-900/20">
          <p className="text-sm text-red-700 dark:text-red-400">
            Connection failed. Please check credentials and retry.
          </p>
        </div>
      )}
    </div>
  )
}