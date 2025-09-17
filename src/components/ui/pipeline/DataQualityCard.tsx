import { cx } from "@/lib/utils"
import { RiArrowUpLine, RiCheckLine, RiAlertLine } from "@remixicon/react"

interface QualityMetric {
  metric: string
  score: number
  status: "good" | "warning" | "error"
}

interface DataQualityCardProps {
  title: string
  value: string
  valueDescription?: string
  change?: string
  changeDescription?: string
  qualityMetrics: QualityMetric[]
}

export function DataQualityCard({
  title,
  value,
  valueDescription,
  change,
  changeDescription,
  qualityMetrics,
}: DataQualityCardProps) {
  const isPositive = change?.startsWith("+")

  const getStatusIcon = (status: QualityMetric["status"]) => {
    switch (status) {
      case "good":
        return <RiCheckLine className="size-4 text-emerald-600 dark:text-emerald-500" />
      case "warning":
        return <RiAlertLine className="size-4 text-amber-600 dark:text-amber-500" />
      case "error":
        return <RiAlertLine className="size-4 text-red-600 dark:text-red-500" />
    }
  }

  const getStatusColor = (status: QualityMetric["status"]) => {
    switch (status) {
      case "good":
        return "text-emerald-700 dark:text-emerald-500"
      case "warning":
        return "text-amber-700 dark:text-amber-500"
      case "error":
        return "text-red-700 dark:text-red-500"
    }
  }

  return (
    <div>
      <h2 className="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-500">
        {title}
      </h2>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          {value}
        </span>
        {valueDescription && (
          <span className="text-sm text-gray-500 dark:text-gray-500">
            {valueDescription}
          </span>
        )}
      </div>
      {change && (
        <div className="mt-2 flex items-center gap-2">
          <span
            className={cx(
              "flex items-center gap-0.5 text-sm font-medium",
              isPositive
                ? "text-emerald-700 dark:text-emerald-500"
                : "text-red-700 dark:text-red-500",
            )}
          >
            <RiArrowUpLine className="size-4" aria-hidden="true" />
            {change}
          </span>
          {changeDescription && (
            <span className="text-sm text-gray-500 dark:text-gray-500">
              {changeDescription}
            </span>
          )}
        </div>
      )}
      <div className="mt-6 space-y-2">
        {qualityMetrics.map((item) => (
          <div
            key={item.metric}
            className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800"
          >
            <div className="flex items-center gap-2">
              {getStatusIcon(item.status)}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.metric}
              </span>
            </div>
            <span className={cx("text-sm font-semibold", getStatusColor(item.status))}>
              {item.score.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}