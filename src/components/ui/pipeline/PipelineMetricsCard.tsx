import { cx } from "@/lib/utils"
import { RiArrowDownLine, RiArrowUpLine } from "@remixicon/react"
import { ProgressBar } from "@/components/ProgressBar"

interface Metric {
  label: string
  value: number
}

interface PipelineMetricsCardProps {
  title: string
  value: string
  valueDescription?: string
  change?: string
  changeDescription?: string
  metrics: Metric[]
}

export function PipelineMetricsCard({
  title,
  value,
  valueDescription,
  change,
  changeDescription,
  metrics,
}: PipelineMetricsCardProps) {
  const isPositive = change?.startsWith("+")
  const totalValue = metrics.reduce((acc, m) => acc + m.value, 0)

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
            {isPositive ? (
              <RiArrowUpLine className="size-4" aria-hidden="true" />
            ) : (
              <RiArrowDownLine className="size-4" aria-hidden="true" />
            )}
            {change}
          </span>
          {changeDescription && (
            <span className="text-sm text-gray-500 dark:text-gray-500">
              {changeDescription}
            </span>
          )}
        </div>
      )}
      <div className="mt-6 space-y-3">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">
                {metric.label}
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-50">
                {metric.value.toLocaleString()}
              </span>
            </div>
            <ProgressBar
              value={(metric.value / totalValue) * 100}
              className="mt-1"
            />
          </div>
        ))}
      </div>
    </div>
  )
}