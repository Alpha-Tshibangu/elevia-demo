import { cx } from "@/lib/utils"
import { RiLineChartLine, RiBarChartLine } from "@remixicon/react"

interface DatabaseScenario {
  id: string
  name: string
  type: string
  description: string | null
  revenueGrowth: number
  marginImprovement: number
  projections?: any[]
}

interface RecentModelsCardProps {
  scenarios: DatabaseScenario[]
}

export function RecentModelsCard({ scenarios }: RecentModelsCardProps) {
  const getScenarioIcon = (type: string) => {
    switch (type) {
      case "optimistic":
        return <RiLineChartLine className="size-4 text-emerald-600 dark:text-emerald-500" />
      case "pessimistic":
        return <RiLineChartLine className="size-4 text-amber-600 dark:text-amber-500" />
      default:
        return <RiBarChartLine className="size-4 text-blue-600 dark:text-blue-500" />
    }
  }

  const getScenarioColor = () => {
    // All scenario types now use the same colors as base case
    return "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50"
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="p-6">
        <div className="space-y-4">
          {scenarios.map((scenario) => {
            // Calculate growth from projections if available, otherwise use assumption
            const revenueGrowthDisplay = scenario.projections && scenario.projections.length > 0
              ? ((scenario.projections[scenario.projections.length - 1].revenue / scenario.projections[0].revenue - 1) * 100).toFixed(1)
              : (Number(scenario.revenueGrowth) * 100).toFixed(1)
            
            return (
              <div
                key={scenario.id}
                className={cx(
                  "rounded-lg border p-4 transition-colors",
                  getScenarioColor()
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getScenarioIcon(scenario.type)}
                    <h3 className="font-medium text-gray-900 dark:text-gray-50">
                      {scenario.name}
                    </h3>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {revenueGrowthDisplay}% growth
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Revenue growth: {(Number(scenario.revenueGrowth) * 100).toFixed(0)}%</span>
                  <span>EBITDA margin improvement: {(Number(scenario.marginImprovement) * 100).toFixed(1)}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}