"use client"
import { ScenarioCard } from "@/components/ui/models/ScenarioCard"
import { ModelChart } from "@/components/ui/models/ModelChart"
import { InteractiveAssumptionsPanel } from "@/components/ui/models/InteractiveAssumptionsPanel"
import { MarketDataStatus } from "@/components/ui/models/MarketDataStatus"
import { calculateDynamicProjections } from "@/lib/model-calculations"
import React from "react"

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

interface HistoricalData {
  date: Date
  revenue: number
  ebitda: number
  cashFlow: number
}

interface ModelsClientProps {
  scenarios: DatabaseScenario[]
  historicalData: HistoricalData[]
}

export function ModelsClient({ scenarios, historicalData }: ModelsClientProps) {
  const baseScenario = scenarios.find(s => s.type === 'base') || scenarios[0]
  const [selectedScenario, setSelectedScenario] = React.useState(baseScenario)
  const [compareScenarios, setCompareScenarios] = React.useState<string[]>([])
  const [dynamicProjections, setDynamicProjections] = React.useState<any[]>(baseScenario.projections)

  const toggleScenarioComparison = (scenarioId: string) => {
    // Don't add the currently selected scenario to comparison
    if (scenarioId === selectedScenario.id) {
      return
    }

    setCompareScenarios(prev =>
      prev.includes(scenarioId)
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    )
  }

  const handleAssumptionsChange = React.useCallback((newAssumptions: Partial<DatabaseScenario>) => {
    // Calculate new projections based on changed assumptions
    const lastHistoricalMetric = historicalData[historicalData.length - 1]
    const newProjections = calculateDynamicProjections(
      {
        revenueGrowth: newAssumptions.revenueGrowth || selectedScenario.revenueGrowth,
        marginImprovement: newAssumptions.marginImprovement || selectedScenario.marginImprovement,
        workingCapitalDays: newAssumptions.workingCapitalDays || selectedScenario.workingCapitalDays,
        capexAsPercentRevenue: newAssumptions.capexAsPercentRevenue || selectedScenario.capexAsPercentRevenue,
      },
      lastHistoricalMetric,
      selectedScenario.type
    )
    setDynamicProjections(newProjections)
  }, [historicalData, selectedScenario])

  // Update dynamic projections when selected scenario changes
  React.useEffect(() => {
    setDynamicProjections(selectedScenario.projections)
  }, [selectedScenario])

  const compareScenarioData = scenarios.filter(s => compareScenarios.includes(s.id))

  // Create enhanced selected scenario with dynamic projections
  const enhancedSelectedScenario = {
    ...selectedScenario,
    projections: dynamicProjections
  }

  return (
    <>
      <section aria-labelledby="financial-models">
        <h1
          id="financial-models"
          className="scroll-mt-10 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
        >
          Financial Models
        </h1>

        <div className="mt-8">
          <MarketDataStatus scenarios={scenarios} />
        </div>

        <div className="mt-8">
          <div id="scenarios" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {scenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                isSelected={selectedScenario.id === scenario.id}
                isComparing={compareScenarios.includes(scenario.id)}
                onSelect={() => setSelectedScenario(scenario)}
                onToggleCompare={() => toggleScenarioComparison(scenario.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="model-projections" className="mt-12">
        <div className="flex items-center justify-between">
          <h2
            id="model-projections"
            className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
          >
            Projections
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Compare:</span>
            {compareScenarios.length === 0 ? (
              <span className="text-gray-400 dark:text-gray-500">Select scenarios above</span>
            ) : (
              <span className="font-medium text-gray-900 dark:text-gray-50">
                {compareScenarios.length} scenario{compareScenarios.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
          <ModelChart
            title="Revenue Forecast"
            metric="revenue"
            selectedScenario={enhancedSelectedScenario}
            compareScenarios={compareScenarioData}
            historicalData={historicalData}
          />
          <ModelChart
            title="EBITDA Forecast"
            metric="ebitda"
            selectedScenario={enhancedSelectedScenario}
            compareScenarios={compareScenarioData}
            historicalData={historicalData}
          />
          <ModelChart
            title="Cash Flow Forecast"
            metric="cashFlow"
            selectedScenario={enhancedSelectedScenario}
            compareScenarios={compareScenarioData}
            historicalData={historicalData}
          />
          <ModelChart
            title="Margin Analysis"
            metric="ebitdaMargin"
            selectedScenario={enhancedSelectedScenario}
            compareScenarios={compareScenarioData}
            historicalData={historicalData}
            isPercentage
          />
        </div>
      </section>

      <section aria-labelledby="assumptions" className="mt-12">
        <div className="mt-6">
          <InteractiveAssumptionsPanel
            scenario={selectedScenario}
            onAssumptionsChange={handleAssumptionsChange}
          />
        </div>
      </section>
    </>
  )
}