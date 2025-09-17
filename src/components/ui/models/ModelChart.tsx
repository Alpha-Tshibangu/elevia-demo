import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

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
  [key: string]: any
}

interface ModelChartProps {
  title: string
  metric: string
  selectedScenario: DatabaseScenario
  compareScenarios: DatabaseScenario[]
  historicalData: HistoricalData[]
  isPercentage?: boolean
}

export function ModelChart({
  title,
  metric,
  selectedScenario,
  compareScenarios,
  historicalData,
  isPercentage = false,
}: ModelChartProps) {
  // Helper function to get metric value with calculation for margins
  const getMetricValue = (data: any, metricKey: string) => {
    if (metricKey === 'ebitdaMargin' && data.ebitda && data.revenue) {
      return (Number(data.ebitda) / Number(data.revenue))
    }
    return data[metricKey]
  }

  // Combine historical and projection data
  const chartData = [
    ...historicalData.map(d => ({
      date: d.date,
      historical: getMetricValue(d, metric),
      [selectedScenario.name]: null,
      ...compareScenarios.reduce((acc, s) => ({ ...acc, [s.name]: null }), {}),
    })),
    ...selectedScenario.projections.map((d, index) => ({
      date: d.date,
      historical: null,
      [selectedScenario.name]: getMetricValue(d, metric),
      ...compareScenarios.reduce((acc, s) => ({
        ...acc,
        [s.name]: getMetricValue(s.projections[index] || {}, metric) || null,
      }), {}),
    })),
  ]

  const formatValue = (value: number) => {
    if (isPercentage) {
      return `${(value * 100).toFixed(1)}%`
    }
    return `$${(value / 1000000).toFixed(1)}M`
  }

  const colors = {
    historical: "#6B7280",
    [selectedScenario.name]: "#4F46E5",
    "Growth Scenario": "#10B981",
    "Conservative": "#F59E0B",
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">
        {title}
      </h3>
      <div className="mt-6">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6B7280" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6B7280" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSelected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOptimistic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPessimistic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.getMonth() + 1}/${date.getFullYear().toString().slice(2)}`
              }}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={formatValue}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip
              formatter={formatValue}
              labelFormatter={(label) => {
                const date = new Date(label)
                return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
              }}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="line"
            />
            <Area
              type="monotone"
              dataKey="historical"
              stroke="#6B7280"
              fill="url(#colorHistorical)"
              strokeWidth={2}
              name="Historical"
            />
            <Area
              type="monotone"
              dataKey={selectedScenario.name}
              stroke={colors[selectedScenario.name]}
              fill="url(#colorSelected)"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            {compareScenarios.map((scenario) => (
              <Area
                key={scenario.id}
                type="monotone"
                dataKey={scenario.name}
                stroke={colors[scenario.name]}
                fill={`url(#color${scenario.type === 'optimistic' ? 'Optimistic' : 'Pessimistic'})`}
                strokeWidth={2}
                strokeDasharray="3 3"
                opacity={0.7}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}