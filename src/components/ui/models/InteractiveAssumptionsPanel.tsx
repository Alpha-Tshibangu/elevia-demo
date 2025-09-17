"use client"
import { useState, useEffect, useMemo } from "react"
import { cx } from "@/lib/utils"
import { RiInformationLine, RiRefreshLine } from "@remixicon/react"

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

interface InteractiveAssumptionsPanelProps {
  scenario: DatabaseScenario
  onAssumptionsChange: (newAssumptions: Partial<DatabaseScenario>) => void
}

export function InteractiveAssumptionsPanel({ scenario, onAssumptionsChange }: InteractiveAssumptionsPanelProps) {
  // Initialize assumptions to around 50% of their range for better user experience
  const [assumptions, setAssumptions] = useState({
    revenueGrowth: 0.4, // 40% (50% of range between -20% and 100%)
    marginImprovement: 0.05, // 5% (50% of range between -10% and 20%)
    workingCapitalDays: 52, // ~50% of range between 15 and 90 days
    capexAsPercentRevenue: 0.13, // 13% (50% of range between 1% and 25%)
  })

  // Update parent component when assumptions change (skip initial render)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (isInitialized) {
      onAssumptionsChange(assumptions)
    } else {
      setIsInitialized(true)
    }
  }, [assumptions, onAssumptionsChange, isInitialized])

  // Default assumptions (around 50% of range)
  const defaultAssumptions = useMemo(() => ({
    revenueGrowth: 0.4, // 40%
    marginImprovement: 0.05, // 5%
    workingCapitalDays: 52, // ~50% of range
    capexAsPercentRevenue: 0.13, // 13%
  }), [])

  // Reset assumptions when scenario changes (but keep our defaults)
  useEffect(() => {
    setAssumptions(defaultAssumptions)
    setIsInitialized(false)
  }, [scenario.id, defaultAssumptions])

  const handleSliderChange = (key: keyof typeof assumptions, value: number) => {
    setAssumptions(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const resetToDefaults = () => {
    setAssumptions(defaultAssumptions)
  }

  const assumptionConfigs = [
    {
      key: 'revenueGrowth' as const,
      label: "Revenue Growth Rate",
      description: "Annual revenue growth assumption",
      impact: "high",
      value: assumptions.revenueGrowth,
      min: -0.2,
      max: 1.0,
      step: 0.01,
      format: (val: number) => `${(val * 100).toFixed(1)}%`,
    },
    {
      key: 'marginImprovement' as const,
      label: "Margin Improvement",
      description: "Expected improvement in EBITDA margins",
      impact: "high",
      value: assumptions.marginImprovement,
      min: -0.1,
      max: 0.2,
      step: 0.005,
      format: (val: number) => `${(val * 100).toFixed(1)}%`,
    },
    {
      key: 'workingCapitalDays' as const,
      label: "Working Capital Days",
      description: "Days of working capital required",
      impact: "medium",
      value: assumptions.workingCapitalDays,
      min: 15,
      max: 90,
      step: 1,
      format: (val: number) => `${val} days`,
    },
    {
      key: 'capexAsPercentRevenue' as const,
      label: "CapEx % of Revenue",
      description: "Capital expenditure as percentage of revenue",
      impact: "medium",
      value: assumptions.capexAsPercentRevenue,
      min: 0.01,
      max: 0.25,
      step: 0.005,
      format: (val: number) => `${(val * 100).toFixed(1)}%`,
    },
  ]

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "border border-elevia-sapphire text-elevia-sapphire bg-transparent dark:border-elevia-azure dark:text-elevia-azure"
      case "medium":
        return "border border-elevia-sapphire text-elevia-sapphire bg-transparent dark:border-elevia-azure dark:text-elevia-azure"
      case "low":
        return "bg-transparent border border-gray-700 text-gray-700 dark:border-gray-400 dark:text-gray-400"
      default:
        return "bg-transparent border border-gray-700 text-gray-700 dark:border-gray-400 dark:text-gray-400"
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">
            Interactive Model Assumptions
          </h3>
          <button
            onClick={resetToDefaults}
            className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <RiRefreshLine className="size-3" />
            Reset to Defaults
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Adjust assumptions and see real-time impact on projections
        </p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {assumptionConfigs.map((config) => (
          <div key={config.key} className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    {config.label}
                  </h4>
                  <span
                    className={cx(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      getImpactColor(config.impact),
                    )}
                  >
                    {config.impact} impact
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {config.description}
                </p>

                {/* Interactive Slider */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{config.format(config.min)}</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                      {config.format(config.value)}
                    </span>
                    <span>{config.format(config.max)}</span>
                  </div>
                  <input
                    type="range"
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    value={config.value}
                    onChange={(e) => handleSliderChange(config.key, parseFloat(e.target.value))}
                    className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-elevia-sapphire [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-elevia-sapphire"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 px-6 py-3 dark:bg-gray-900/50">
        <div className="flex items-start gap-2">
          <RiInformationLine className="mt-0.5 size-4 text-gray-400" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Model calculations update in real-time as you adjust these assumptions. Changes affect revenue projections, margin expansion, and cash flow forecasts.
          </p>
        </div>
      </div>
    </div>
  )
}