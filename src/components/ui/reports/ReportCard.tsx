import { cx } from "@/lib/utils"
import { RiDownloadLine, RiPlayLine, RiSettingsLine } from "@remixicon/react"

interface ReportCardProps {
  report: {
    id: string
    title: string
    description: string
    lastGenerated: Date
    frequency: string
    icon: React.ComponentType<{ className?: string }>
    status: "ready" | "scheduled" | "overdue"
  }
}

export function ReportCard({ report }: ReportCardProps) {
  const getStaticTimeString = (reportId: string) => {
    const staticTimes = {
      'board-deck': '10 days ago',
      'investor-update': '21 days ago', 
      'management-report': '3 days ago',
      'compliance-report': '11 days ago'
    }
    return staticTimes[reportId as keyof typeof staticTimes] || '1 week ago'
  }
  const getStatusColor = (status: typeof report.status) => {
    switch (status) {
      case "ready":
        return "bg-transparent border border-emerald-700 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400"
      case "scheduled":
        return "bg-transparent border border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-400"
      case "overdue":
        return "bg-transparent border border-red-700 text-red-700 dark:border-red-400 dark:text-red-400"
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-800">
            <report.icon className="size-6 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50">
              {report.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {report.description}
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                Frequency: <span className="font-medium text-gray-700 dark:text-gray-300">{report.frequency}</span>
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                Last: <span className="font-medium text-gray-700 dark:text-gray-300">
                  {getStaticTimeString(report.id)}
                </span>
              </span>
            </div>
          </div>
        </div>
        <span
          className={cx(
            "rounded-full px-2.5 py-1 text-xs font-medium",
            getStatusColor(report.status),
          )}
        >
          {report.status}
        </span>
      </div>

      <div className="mt-6 flex gap-2">
        <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
          <RiPlayLine className="size-4" />
          Generate Now
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          <RiDownloadLine className="size-4" />
          Export
        </button>
        <button className="inline-flex items-center justify-center rounded-md bg-gray-100 p-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          <RiSettingsLine className="size-4" />
        </button>
      </div>
    </div>
  )
}