interface ModelAssumptions {
  revenueGrowth: number
  marginImprovement: number
  workingCapitalDays: number
  capexAsPercentRevenue: number
}

interface HistoricalMetric {
  date: Date
  revenue: number
  ebitda: number
  cashFlow: number
}

interface ModelProjection {
  date: Date
  revenue: number
  cogs: number
  grossProfit: number
  opex: number
  ebitda: number
  netIncome: number
  cashFlow: number
}

export function calculateDynamicProjections(
  assumptions: ModelAssumptions,
  lastHistoricalMetric: HistoricalMetric,
  scenarioType: string = 'base'
): ModelProjection[] {
  const projections: ModelProjection[] = []

  for (let i = 1; i <= 36; i++) { // 3 years of projections
    const projectionDate = new Date(lastHistoricalMetric.date)
    projectionDate.setMonth(projectionDate.getMonth() + i)

    // Add seasonality and variance for realistic curves
    const month = projectionDate.getMonth()
    const seasonalityFactor = 1 + 0.1 * Math.sin((month * Math.PI) / 6)

    // Different variance levels based on scenario type
    const baseVariance = scenarioType === 'base' ? 0.02 : scenarioType === 'optimistic' ? 0.04 : 0.06
    const randomVariance = 1 + (Math.random() - 0.5) * baseVariance * 2

    // Quarterly bumps
    const quarterlyBump = (month + 1) % 3 === 0 ? 1.03 : 1.0

    // Economic cycle effect
    const cycleFactor = 1 + 0.02 * Math.sin((i * Math.PI) / 18)

    // Calculate revenue with user's growth rate
    const monthlyGrowth = Math.pow(1 + assumptions.revenueGrowth, 1/12)
    const baseRevenue = lastHistoricalMetric.revenue * Math.pow(monthlyGrowth, i)
    const projectedRevenue = baseRevenue * seasonalityFactor * randomVariance * quarterlyBump * cycleFactor

    // Margin improvement over time (diminishing returns)
    const marginProgress = Math.pow(i / 36, 0.7)
    const marginVariance = 1 + (Math.random() - 0.5) * 0.01
    const projectedCogs = projectedRevenue * (0.35 - assumptions.marginImprovement * marginProgress * marginVariance)
    const projectedGrossProfit = projectedRevenue - projectedCogs

    // OpEx with efficiency improvements
    const opexEfficiency = 1 - (i / 36) * 0.015 // 1.5% efficiency improvement over 3 years
    const opexVariance = 1 + (Math.random() - 0.5) * 0.02
    const projectedOpex = projectedRevenue * 0.25 * opexEfficiency * opexVariance

    const projectedEbitda = projectedGrossProfit - projectedOpex

    // Tax rate with some variance
    const taxRate = 0.25 + (Math.random() - 0.5) * 0.03
    const projectedNetIncome = projectedEbitda * (1 - taxRate)

    // Cash flow calculation including working capital impact
    const workingCapitalChange = (projectedRevenue - (i === 1 ? lastHistoricalMetric.revenue : projections[i-2]?.revenue || lastHistoricalMetric.revenue)) * (assumptions.workingCapitalDays / 365)
    const depreciation = projectedRevenue * assumptions.capexAsPercentRevenue * 0.8 // Assume 80% of CapEx is depreciable
    const projectedCashFlow = projectedNetIncome + depreciation - workingCapitalChange - (projectedRevenue * assumptions.capexAsPercentRevenue)

    projections.push({
      date: projectionDate,
      revenue: Math.round(projectedRevenue),
      cogs: Math.round(projectedCogs),
      grossProfit: Math.round(projectedGrossProfit),
      opex: Math.round(projectedOpex),
      ebitda: Math.round(projectedEbitda),
      netIncome: Math.round(projectedNetIncome),
      cashFlow: Math.round(projectedCashFlow),
    })
  }

  return projections
}

export function calculateProjectionMetrics(projections: ModelProjection[]) {
  if (projections.length === 0) return null

  const firstYear = projections.slice(0, 12)
  const secondYear = projections.slice(12, 24)
  const thirdYear = projections.slice(24, 36)

  const calculateYearMetrics = (yearProjections: ModelProjection[]) => ({
    revenue: yearProjections.reduce((sum, p) => sum + p.revenue, 0),
    ebitda: yearProjections.reduce((sum, p) => sum + p.ebitda, 0),
    cashFlow: yearProjections.reduce((sum, p) => sum + p.cashFlow, 0),
  })

  return {
    year1: calculateYearMetrics(firstYear),
    year2: calculateYearMetrics(secondYear),
    year3: calculateYearMetrics(thirdYear),
    totalRevenue: projections.reduce((sum, p) => sum + p.revenue, 0),
    averageEbitdaMargin: projections.reduce((sum, p) => sum + (p.ebitda / p.revenue), 0) / projections.length,
  }
}