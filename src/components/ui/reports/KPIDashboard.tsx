import { cx } from "@/lib/utils"
import { RiArrowUpLine, RiArrowDownLine } from "@remixicon/react"

interface KPIDashboardProps {
  kpis: {
    revenue: {
      current: number
      previous: number
      change: number
    }
    ebitda: {
      current: number
      previous: number
      change: number
    }
    cashFlow: {
      current: number
      previous: number
      change: number
    }
    dataQuality: {
      score: number
      sourcesActive: number
      totalSources: number
    }
  }
}

export function KPIDashboard({ kpis }: KPIDashboardProps) {
  const formatCurrency = (value: number) => {
    return `$${(value / 1000000).toFixed(1)}M`
  }

  const metrics = [
    {
      title: "Revenue",
      value: formatCurrency(kpis.revenue.current),
      change: kpis.revenue.change,
      description: "Current month",
      trend: kpis.revenue.change > 0 ? "up" : "down",
    },
    {
      title: "EBITDA",
      value: formatCurrency(kpis.ebitda.current),
      change: kpis.ebitda.change,
      description: "Current month",
      trend: kpis.ebitda.change > 0 ? "up" : "down",
    },
    {
      title: "Cash Flow",
      value: formatCurrency(kpis.cashFlow.current),
      change: kpis.cashFlow.change,
      description: "Current month",
      trend: kpis.cashFlow.change > 0 ? "up" : "down",
    },
    {
      title: "Data Quality",
      value: `${kpis.dataQuality.score.toFixed(1)}%`,
      change: 2.1,
      description: `${kpis.dataQuality.sourcesActive}/${kpis.dataQuality.totalSources} sources`,
      trend: "up",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.title}
          className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-500">
            {metric.title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
              {metric.value}
            </span>
            <span
              className={cx(
                "flex items-center gap-0.5 text-sm font-medium",
                metric.trend === "up"
                  ? "text-emerald-700 dark:text-emerald-500"
                  : "text-red-700 dark:text-red-500",
              )}
            >
              {metric.trend === "up" ? (
                <RiArrowUpLine className="size-4" />
              ) : (
                <RiArrowDownLine className="size-4" />
              )}
              {Math.abs(metric.change).toFixed(1)}%
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {metric.description}
          </p>
        </div>
      ))}
    </div>
  )
}