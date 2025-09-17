import { cx } from "@/lib/utils"
import { RiCheckLine, RiTimeLine, RiAlertLine } from "@remixicon/react"
import { PowerPointIcon, ExcelIcon, InvestorUpdateIcon } from "@/components/icons/DocumentIcons"
// Utility functions moved inline
const getRelativeTime = (date: Date | string | null) => {
  if (!date) return 'Never'
  const now = new Date()
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  return `${Math.floor(diffInDays / 30)} months ago`
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ready':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'overdue':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
  }
}

interface Report {
  id: string
  title: string
  description: string | null
  type: string
  status: string
  lastGenerated: Date | string | null
}

interface RecentReportsCardProps {
  reports: Report[]
}

export function RecentReportsCard({ reports }: RecentReportsCardProps) {
  // Get report type icon
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <RiCheckLine className="size-4 text-emerald-600 dark:text-emerald-500" />
      case "scheduled":
        return <RiTimeLine className="size-4 text-blue-600 dark:text-blue-500" />
      case "overdue":
        return <RiAlertLine className="size-4 text-red-600 dark:text-red-500" />
      default:
        return <RiTimeLine className="size-4 text-gray-400" />
    }
  }

  // Take the most recent 3 reports
  const recentReports = reports.slice(0, 3)

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="p-6">
        <div className="space-y-4">
          {recentReports.map((report) => {
            const IconComponent = getReportIcon(report.type)
            return (
              <div
                key={report.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-1.5 dark:bg-gray-800">
                    <IconComponent className="size-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      {report.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {report.description}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {getRelativeTime(report.lastGenerated)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(report.status)}
                  <span
                    className={cx(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      getStatusColor(report.status)
                    )}
                  >
                    {report.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}