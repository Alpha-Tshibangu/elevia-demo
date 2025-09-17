/**
 * API Client for Elevia Financial Intelligence FastAPI Backend
 *
 * Provides type-safe client for communicating with the Python FastAPI server
 * that demonstrates sophisticated quantitative modeling and data science capabilities.
 */

// Use proxy in production to avoid mixed content issues
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (isProduction
  ? '/api/proxy/api/v1'
  : 'http://45.55.152.121:8000/api/v1')

class EleviaAPIClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return null
      }

      return await response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      return null
    }
  }

  // Organization endpoints
  async getOrganization() {
    return this.request('/organizations/')
  }

  // Financial metrics endpoints with sophisticated quantitative modeling
  async getFinancialMetrics(months: number = 24) {
    return this.request(`/financial-metrics/?months=${months}`)
  }

  async getModelScenarios() {
    return this.request('/financial-metrics/scenarios')
  }

  // Data sources with pipeline quality metrics
  async getDataSources() {
    return this.request('/data-sources/')
  }

  // Transaction management
  async getTransaction() {
    return this.request('/transactions/')
  }

  async getDueDiligenceProgress() {
    return this.request('/transactions/due-diligence')
  }

  // Institutional reporting
  async getReports() {
    return this.request('/reports/')
  }

  // Health check for backend connectivity
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl.replace('/api/v1', '')}/health`)
      return response.ok
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const apiClient = new EleviaAPIClient()

// Export types for TypeScript integration
export interface FinancialMetricsResponse {
  metrics: FinancialMetric[]
  latest: FinancialMetric | null
  summary: {
    totalRevenue: number
    totalEbitda: number
    totalCashFlow: number
    grossMargin: number
    monthOverMonth: number
    yearOverYear: number
    ytdRevenue: number
    ytdEbitda: number
  }
}

export interface FinancialMetric {
  id: string
  date: string
  revenue: number
  cogs: number
  grossProfit: number
  opex: number
  ebitda: number
  netIncome: number
  cashFlow: number
}

export interface ModelScenario {
  id: string
  name: string
  type: string
  description: string | null
  revenueGrowth: number
  marginImprovement: number
  workingCapitalDays: number
  capexAsPercentRevenue: number
  projections: ModelProjection[]
}

export interface ModelProjection {
  id: string
  date: string
  revenue: number
  cogs: number
  grossProfit: number
  opex: number
  ebitda: number
  netIncome: number
  cashFlow: number
}

export interface DataSourcesResponse {
  sources: DataSource[]
  summary: {
    totalSources: number
    activeSources: number
    errorSources: number
    totalRecords: number
    averageQuality: number
  }
}

export interface DataSource {
  id: string
  name: string
  sourceType: string
  status: string
  lastSync: string | null
  nextSync: string | null
  recordsProcessed: number
  dataQuality: number
  errorMessage: string | null
  iconUrl: string | null
}

export interface Transaction {
  id: string
  name: string
  description: string | null
  valuation: number | null
  multiple: string | null
  irr: number | null
  paybackYears: number | null
  status: string
  photoUrl: string | null
  documents: TransactionDocument[]
  dueDiligenceTasks: DueDiligenceTask[]
}

export interface TransactionDocument {
  id: string
  name: string
  category: string
  fileName: string | null
  mimeType: string | null
  size: number
  status: string
  uploadDate: string
  reviewer: {
    id: string
    name: string
    email: string
  } | null
}

export interface DueDiligenceTask {
  id: string
  task: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  completedAt: string | null
  createdAt: string
  assignee: {
    id: string
    name: string
    email: string
  } | null
}

export interface ReportsResponse {
  reports: Report[]
  summary: {
    total: number
    ready: number
    scheduled: number
    overdue: number
  }
}

export interface Report {
  id: string
  title: string
  description: string | null
  type: string
  frequency: string | null
  status: string
  lastGenerated: string | null
  nextDue: string | null
  fileUrl: string | null
  iconUrl: string | null
}