interface DatabaseScenario {
  id: string
  name: string
  type: string
  description: string | null
  revenueGrowth: number
  marginImprovement: number
  workingCapitalDays: number
  capexAsPercentRevenue: number
  projections: any[]
}
import { cx } from "@/lib/utils"
import { RiInformationLine } from "@remixicon/react"

interface AssumptionsPanelProps {
  scenario: DatabaseScenario
}

export function AssumptionsPanel({ scenario }: AssumptionsPanelProps) {
  const assumptions = [
    {
      label: "Revenue Growth Rate",
      value: `${(scenario.revenueGrowth * 100).toFixed(1)}%`,
      description: "Annual revenue growth assumption",
      impact: "high",
    },
    {
      label: "Margin Improvement",
      value: `${(scenario.marginImprovement * 100).toFixed(1)}%`,
      description: "Expected improvement in EBITDA margins",
      impact: "high",
    },
    {
      label: "Working Capital Days",
      value: `${scenario.workingCapitalDays} days`,
      description: "Days of working capital required",
      impact: "medium",
    },
    {
      label: "CapEx % of Revenue",
      value: `${(scenario.capexAsPercentRevenue * 100).toFixed(1)}%`,
      description: "Capital expenditure as percentage of revenue",
      impact: "medium",
    },
  ]

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-transparent border border-red-700 text-red-700 dark:border-red-400 dark:text-red-400"
      case "medium":
        return "bg-transparent border border-amber-700 text-amber-700 dark:border-amber-400 dark:text-amber-400"
      case "low":
        return "bg-transparent border border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-400"
      default:
        return "bg-transparent border border-gray-700 text-gray-700 dark:border-gray-400 dark:text-gray-400"
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">
            {scenario.name} Assumptions
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Sensitivity Impact
          </span>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {assumptions.map((assumption) => (
          <div key={assumption.label} className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    {assumption.label}
                  </h4>
                  <span
                    className={cx(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      getImpactColor(assumption.impact),
                    )}
                  >
                    {assumption.impact} impact
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {assumption.description}
                </p>
              </div>
              <div className="ml-4 text-right">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                  {assumption.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 px-6 py-3 dark:bg-gray-900/50">
        <div className="flex items-start gap-2">
          <RiInformationLine className="mt-0.5 size-4 text-gray-400" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            These assumptions drive the financial projections. Adjust sensitivity analysis to understand impact on valuation.
          </p>
        </div>
      </div>
    </div>
  )
}