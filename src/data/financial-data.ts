export interface FinancialMetrics {
  date: string
  revenue: number
  cogs: number
  grossProfit: number
  opex: number
  ebitda: number
  ebit: number
  netIncome: number
  cashFlow: number
  workingCapital: number
  grossMargin: number
  ebitdaMargin: number
  netMargin: number
}

export interface DataPipelineMetrics {
  id: string
  sourceName: string
  sourceType: 'Excel' | 'CSV' | 'API' | 'Database' | 'PDF'
  status: 'active' | 'syncing' | 'error' | 'inactive'
  lastSync: Date
  recordsProcessed: number
  dataQuality: number
  nextSync: Date
}

export interface ModelScenario {
  id: string
  name: string
  type: 'base' | 'optimistic' | 'pessimistic' | 'custom'
  assumptions: {
    revenueGrowth: number
    marginImprovement: number
    workingCapitalDays: number
    capexAsPercentOfRevenue: number
  }
  projections: FinancialMetrics[]
}

export interface TransactionDocument {
  id: string
  name: string
  category: 'financial' | 'legal' | 'operational' | 'commercial'
  uploadDate: Date
  size: number
  status: 'pending' | 'reviewed' | 'approved'
  reviewer?: string
}

// Generate mock financial data
const generateFinancialData = (startDate: Date, periods: number, baseRevenue: number = 1000000): FinancialMetrics[] => {
  const data: FinancialMetrics[] = []
  let revenue = baseRevenue
  
  for (let i = 0; i < periods; i++) {
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + i)
    
    // Add some growth and seasonality
    revenue = revenue * (1 + (Math.random() * 0.1 - 0.02))
    const grossMargin = 0.35 + Math.random() * 0.1
    const ebitdaMargin = 0.15 + Math.random() * 0.1
    const netMargin = 0.08 + Math.random() * 0.05
    
    const cogs = revenue * (1 - grossMargin)
    const grossProfit = revenue - cogs
    const ebitda = revenue * ebitdaMargin
    const opex = grossProfit - ebitda
    const ebit = ebitda - (revenue * 0.02) // Depreciation
    const netIncome = revenue * netMargin
    const cashFlow = ebitda + (Math.random() * 100000 - 50000)
    const workingCapital = revenue * 0.15 * (1 + Math.random() * 0.2 - 0.1)
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(revenue),
      cogs: Math.round(cogs),
      grossProfit: Math.round(grossProfit),
      opex: Math.round(opex),
      ebitda: Math.round(ebitda),
      ebit: Math.round(ebit),
      netIncome: Math.round(netIncome),
      cashFlow: Math.round(cashFlow),
      workingCapital: Math.round(workingCapital),
      grossMargin: Math.round(grossMargin * 100) / 100,
      ebitdaMargin: Math.round(ebitdaMargin * 100) / 100,
      netMargin: Math.round(netMargin * 100) / 100,
    })
  }
  
  return data
}

// Historical financial data (last 24 months)
export const historicalFinancials = generateFinancialData(new Date('2023-01-01'), 24)

// Mock data pipeline sources
export const dataSources: DataPipelineMetrics[] = [
  {
    id: '1',
    sourceName: 'QuickBooks P&L',
    sourceType: 'API',
    status: 'active',
    lastSync: new Date('2025-01-11T10:30:00'),
    recordsProcessed: 15420,
    dataQuality: 98.5,
    nextSync: new Date('2025-01-11T16:30:00'),
  },
  {
    id: '2',
    sourceName: 'Salesforce CRM',
    sourceType: 'API',
    status: 'active',
    lastSync: new Date('2025-01-11T09:15:00'),
    recordsProcessed: 8932,
    dataQuality: 96.2,
    nextSync: new Date('2025-01-11T15:15:00'),
  },
  {
    id: '3',
    sourceName: 'Monthly Financials',
    sourceType: 'Excel',
    status: 'syncing',
    lastSync: new Date('2025-01-10T22:00:00'),
    recordsProcessed: 2450,
    dataQuality: 94.8,
    nextSync: new Date('2025-01-11T22:00:00'),
  },
  {
    id: '4',
    sourceName: 'Bank Statements',
    sourceType: 'CSV',
    status: 'active',
    lastSync: new Date('2025-01-11T06:00:00'),
    recordsProcessed: 12890,
    dataQuality: 99.1,
    nextSync: new Date('2025-01-12T06:00:00'),
  },
  {
    id: '5',
    sourceName: 'Inventory System',
    sourceType: 'Database',
    status: 'error',
    lastSync: new Date('2025-01-10T14:30:00'),
    recordsProcessed: 45200,
    dataQuality: 87.3,
    nextSync: new Date('2025-01-11T14:30:00'),
  },
]

// Model scenarios
export const modelScenarios: ModelScenario[] = [
  {
    id: 'base',
    name: 'Base Case',
    type: 'base',
    assumptions: {
      revenueGrowth: 0.15,
      marginImprovement: 0.02,
      workingCapitalDays: 45,
      capexAsPercentOfRevenue: 0.05,
    },
    projections: generateFinancialData(new Date('2025-01-01'), 36, historicalFinancials[historicalFinancials.length - 1].revenue),
  },
  {
    id: 'optimistic',
    name: 'Growth Scenario',
    type: 'optimistic',
    assumptions: {
      revenueGrowth: 0.25,
      marginImprovement: 0.05,
      workingCapitalDays: 40,
      capexAsPercentOfRevenue: 0.07,
    },
    projections: generateFinancialData(new Date('2025-01-01'), 36, historicalFinancials[historicalFinancials.length - 1].revenue * 1.1),
  },
  {
    id: 'pessimistic',
    name: 'Conservative',
    type: 'pessimistic',
    assumptions: {
      revenueGrowth: 0.08,
      marginImprovement: 0,
      workingCapitalDays: 50,
      capexAsPercentOfRevenue: 0.03,
    },
    projections: generateFinancialData(new Date('2025-01-01'), 36, historicalFinancials[historicalFinancials.length - 1].revenue * 0.95),
  },
]

// Transaction documents
export const transactionDocuments: TransactionDocument[] = [
  {
    id: '1',
    name: 'FY2024 Audited Financials.pdf',
    category: 'financial',
    uploadDate: new Date('2025-01-05'),
    size: 2456789,
    status: 'approved',
    reviewer: 'John Smith',
  },
  {
    id: '2',
    name: 'Customer Contracts Summary.xlsx',
    category: 'commercial',
    uploadDate: new Date('2025-01-08'),
    size: 1234567,
    status: 'reviewed',
    reviewer: 'Sarah Johnson',
  },
  {
    id: '3',
    name: 'Operating Agreement.pdf',
    category: 'legal',
    uploadDate: new Date('2025-01-10'),
    size: 890123,
    status: 'pending',
  },
  {
    id: '4',
    name: 'Management Presentation.pptx',
    category: 'operational',
    uploadDate: new Date('2025-01-11'),
    size: 5678901,
    status: 'reviewed',
    reviewer: 'Mike Chen',
  },
]

// KPI summary for dashboard
export const kpiSummary = {
  revenue: {
    current: historicalFinancials[historicalFinancials.length - 1].revenue,
    previous: historicalFinancials[historicalFinancials.length - 2].revenue,
    change: ((historicalFinancials[historicalFinancials.length - 1].revenue / historicalFinancials[historicalFinancials.length - 2].revenue) - 1) * 100,
  },
  ebitda: {
    current: historicalFinancials[historicalFinancials.length - 1].ebitda,
    previous: historicalFinancials[historicalFinancials.length - 2].ebitda,
    change: ((historicalFinancials[historicalFinancials.length - 1].ebitda / historicalFinancials[historicalFinancials.length - 2].ebitda) - 1) * 100,
  },
  cashFlow: {
    current: historicalFinancials[historicalFinancials.length - 1].cashFlow,
    previous: historicalFinancials[historicalFinancials.length - 2].cashFlow,
    change: ((historicalFinancials[historicalFinancials.length - 1].cashFlow / historicalFinancials[historicalFinancials.length - 2].cashFlow) - 1) * 100,
  },
  dataQuality: {
    score: dataSources.reduce((acc, source) => acc + source.dataQuality, 0) / dataSources.length,
    sourcesActive: dataSources.filter(s => s.status === 'active').length,
    totalSources: dataSources.length,
  },
}