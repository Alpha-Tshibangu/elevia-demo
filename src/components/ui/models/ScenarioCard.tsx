import { cx } from "@/lib/utils"
import { RiCheckLine, RiLineChartLine } from "@remixicon/react"

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
  analytics?: {
    sharpe_ratio: number
    max_drawdown: number
    realized_volatility: number
    market_regime: string
  }
}

interface ScenarioCardProps {
  scenario: DatabaseScenario
  isSelected: boolean
  isComparing: boolean
  onSelect: () => void
  onToggleCompare: () => void
}

export function ScenarioCard({
  scenario,
  isSelected,
  isComparing,
  onSelect,
  onToggleCompare,
}: ScenarioCardProps) {
  const getScenarioColor = () => {
    // All scenario types now use the same colors as base case
    return "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50"
  }


  // Handle scenarios with no projections (like Bloomberg scenarios)
  const hasProjections = scenario.projections && scenario.projections.length > 0
  const latestProjection = hasProjections ? scenario.projections[scenario.projections.length - 1] : null
  const firstProjection = hasProjections ? scenario.projections[0] : null
  const revenueGrowth = hasProjections && latestProjection?.revenue && firstProjection?.revenue
    ? ((latestProjection.revenue / firstProjection.revenue - 1) * 100).toFixed(1)
    : scenario.revenueGrowth?.toString() || 'N/A'

  return (
    <div
      className={cx(
        "relative rounded-lg border p-6 transition-all cursor-pointer",
        isSelected
          ? "border-elevia-sapphire bg-elevia-light-lilac dark:border-elevia-sapphire dark:bg-elevia-indigo/20"
          : getScenarioColor(),
      )}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="absolute -top-3 -right-3 rounded-full bg-elevia-sapphire p-1.5 dark:bg-elevia-sapphire">
          <RiCheckLine className="size-4 text-white" />
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              {scenario.name}
            </h3>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Revenue growth: <span className="font-semibold">{revenueGrowth}%</span>
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Revenue Growth</span>
          <span className="font-medium text-gray-900 dark:text-gray-50">
            {scenario.revenueGrowth >= 1 ? scenario.revenueGrowth.toFixed(0) : (scenario.revenueGrowth * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Margin Improvement</span>
          <span className="font-medium text-gray-900 dark:text-gray-50">
            {scenario.marginImprovement >= 1 ? scenario.marginImprovement.toFixed(1) : (scenario.marginImprovement * 100).toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Working Capital Days</span>
          <span className="font-medium text-gray-900 dark:text-gray-50">
            {scenario.workingCapitalDays}
          </span>
        </div>

        {scenario.analytics && (
          <>
            <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-2">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                Bloomberg Analytics
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Sharpe Ratio</span>
                <span className="font-medium text-gray-900 dark:text-gray-50">
                  {scenario.analytics.sharpe_ratio.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Max Drawdown</span>
                <span className="font-medium text-gray-900 dark:text-gray-50">
                  {(scenario.analytics.max_drawdown * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleCompare()
        }}
        disabled={isSelected}
        className={cx(
          "mt-4 w-full rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isSelected
            ? "bg-gray-50 text-gray-400 cursor-not-allowed dark:bg-gray-900 dark:text-gray-600"
            : isComparing
            ? "bg-elevia-sapphire text-white hover:bg-elevia-indigo dark:bg-elevia-sapphire dark:hover:bg-elevia-indigo"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
        )}
      >
        <div className="flex items-center justify-center gap-2">
          <RiLineChartLine className="size-4" />
          {isSelected ? "Currently viewing" : isComparing ? "Remove from comparison" : "Add to comparison"}
        </div>
      </button>
    </div>
  )
}