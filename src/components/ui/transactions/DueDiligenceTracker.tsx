import { cx } from "@/lib/utils"
import { RiCheckLine, RiTimeLine, RiLoader4Line } from "@remixicon/react"

interface DueDiligenceItem {
  task: string
  status: "completed" | "in-progress" | "pending"
  assignee: string
}

interface DueDiligenceTrackerProps {
  items: DueDiligenceItem[]
}

export function DueDiligenceTracker({ items }: DueDiligenceTrackerProps) {
  const completedCount = items.filter(i => i.status === "completed").length
  const completionPercentage = (completedCount / items.length) * 100

  const getStatusIcon = (status: DueDiligenceItem["status"]) => {
    switch (status) {
      case "completed":
        return <RiCheckLine className="size-5 text-emerald-600 dark:text-emerald-500" />
      case "in-progress":
        return <RiLoader4Line className="size-5 text-blue-600 dark:text-blue-500 animate-spin" />
      case "pending":
        return <RiTimeLine className="size-5 text-gray-400 dark:text-gray-600" />
    }
  }

  const getStatusColor = (status: DueDiligenceItem["status"]) => {
    switch (status) {
      case "completed":
        return "bg-transparent border border-emerald-700 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400"
      case "in-progress":
        return "bg-transparent border border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-400"
      case "pending":
        return "bg-transparent border border-gray-700 text-gray-700 dark:border-gray-400 dark:text-gray-400"
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">
              Due Diligence Checklist
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {completedCount} of {items.length} tasks completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              {completionPercentage.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Complete</p>
          </div>
        </div>
        <div className="mt-4 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
          <div
            className="h-2 rounded-full bg-indigo-600 transition-all duration-500 dark:bg-indigo-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(item.status)}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {item.task}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Assigned to: {item.assignee}
                </p>
              </div>
            </div>
            <span
              className={cx(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                getStatusColor(item.status),
              )}
            >
              {item.status.replace("-", " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}