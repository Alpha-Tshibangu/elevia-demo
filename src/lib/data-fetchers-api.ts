/**
 * API-based data fetchers for Elevia Financial Intelligence Platform
 *
 * Replaces Prisma-based data fetchers with FastAPI backend calls,
 * demonstrating sophisticated Python quantitative modeling capabilities.
 */

import { cache } from 'react'
import { apiClient } from '@/lib/api-client'
import type {
  FinancialMetricsResponse,
  ModelScenario,
  Transaction
} from '@/lib/api-client'

// Cache organization data for the request duration
export const getOrganization = cache(async () => {
  try {
    const organization = await apiClient.getOrganization()
    if (!organization) {
      console.error('No organization found via API')
      return null
    }
    return organization
  } catch (error) {
    console.error('Error fetching organization via API:', error)
    return null
  }
})

// Cache user data for the request duration
export const getCurrentUser = cache(async () => {
  try {
    // For now, return a static user since we don't have user management in the API yet
    return {
      id: '1',
      name: 'Kenn Savvas',
      email: 'kenn.savvas@elevia.com',
      role: 'admin',
      photoUrl: 'https://ui-avatars.com/api/?name=Kenn+Savvas&background=2933f5&color=fff'
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
})

// Get financial metrics with sophisticated Python-based calculations
export const getFinancialMetrics = cache(async (months: number = 24) => {
  try {
    const data = await apiClient.getFinancialMetrics(months) as FinancialMetricsResponse | null
    if (!data) {
      console.error('No financial metrics found via API')
      return null
    }

    // Transform to match existing frontend interface
    return {
      metrics: (data as any).metrics.map((metric: any) => ({
        ...metric,
        date: new Date(metric.date),
        // Convert API response format to match existing interface
        grossProfit: metric.grossProfit,
        netIncome: metric.netIncome,
        cashFlow: metric.cashFlow
      })),
      latest: (data as any).latest ? {
        ...(data as any).latest,
        date: new Date((data as any).latest.date),
        grossProfit: (data as any).latest.grossProfit,
        netIncome: (data as any).latest.netIncome,
        cashFlow: (data as any).latest.cashFlow
      } : null,
      summary: {
        totalRevenue: (data as any).summary.totalRevenue,
        totalEbitda: (data as any).summary.totalEbitda,
        totalCashFlow: (data as any).summary.totalCashFlow,
        grossMargin: (data as any).summary.grossMargin,
        monthOverMonth: (data as any).summary.monthOverMonth,
        yearOverYear: (data as any).summary.yearOverYear,
        ytdRevenue: (data as any).summary.ytdRevenue,
        ytdEbitda: (data as any).summary.ytdEbitda,
      }
    }
  } catch (error) {
    console.error('Error fetching financial metrics via API:', error)
    return null
  }
})

// Get data sources with Python-based pipeline quality metrics
export const getDataSources = cache(async () => {
  try {
    const data = await apiClient.getDataSources()
    if (!data) {
      console.error('No data sources found via API')
      return { sources: [], summary: null }
    }

    // Transform data to match existing interface
    const transformedSources = (data as any).sources?.map((source: any) => ({
      ...source,
      lastSync: source.lastSync ? new Date(source.lastSync) : null,
      nextSync: source.nextSync ? new Date(source.nextSync) : null,
      syncLogs: [] // Sync logs are included in the API response but simplified here
    }))

    return {
      sources: transformedSources,
      summary: {
        totalSources: (data as any).summary.totalSources,
        activeSources: (data as any).summary.activeSources,
        errorSources: (data as any).summary.errorSources,
        totalRecords: (data as any).summary.totalRecords,
        averageQuality: (data as any).summary.averageQuality,
      }
    }
  } catch (error) {
    console.error('Error fetching data sources via API:', error)
    return { sources: [], summary: null }
  }
})

// Get model scenarios with advanced Python-based financial projections
export const getModelScenarios = cache(async () => {
  try {
    const scenarios = await apiClient.getModelScenarios() as ModelScenario[] | null
    if (!scenarios) {
      console.error('No model scenarios found via API')
      return []
    }

    // Transform scenarios to match existing interface
    return scenarios.map(scenario => ({
      ...scenario,
      // Convert API response to match existing naming conventions
      revenueGrowth: scenario.revenueGrowth,
      marginImprovement: scenario.marginImprovement,
      workingCapitalDays: scenario.workingCapitalDays,
      capexAsPercentRevenue: scenario.capexAsPercentRevenue,
      projections: scenario.projections.map(projection => ({
        ...projection,
        date: new Date(projection.date),
        grossProfit: projection.grossProfit,
        netIncome: projection.netIncome,
        cashFlow: projection.cashFlow
      }))
    }))
  } catch (error) {
    console.error('Error fetching model scenarios via API:', error)
    return []
  }
})

// Get reports with institutional reporting patterns
export const getReports = cache(async () => {
  try {
    const data = await apiClient.getReports()
    if (!data) {
      console.error('No reports found via API')
      return { reports: [], summary: null }
    }

    // Transform reports to match existing interface
    const transformedReports = (data as any).reports.map((report: any) => ({
      ...report,
      lastGenerated: report.lastGenerated ? new Date(report.lastGenerated) : null,
      nextDue: report.nextDue ? new Date(report.nextDue) : null
    }))

    return {
      reports: transformedReports,
      summary: {
        total: (data as any).summary.total,
        ready: (data as any).summary.ready,
        scheduled: (data as any).summary.scheduled,
        overdue: (data as any).summary.overdue,
      }
    }
  } catch (error) {
    console.error('Error fetching reports via API:', error)
    return { reports: [], summary: null }
  }
})

// Get transaction with comprehensive deal data
export const getTransaction = cache(async () => {
  try {
    const transaction = await apiClient.getTransaction() as Transaction | null
    if (!transaction) {
      console.error('No transaction found via API')
      return null
    }

    // Transform transaction to match existing interface
    return {
      ...transaction,
      documents: transaction.documents.map(doc => ({
        ...doc,
        uploadDate: new Date(doc.uploadDate),
        fileName: doc.fileName,
        mimeType: doc.mimeType
      })),
      dueDiligenceTasks: transaction.dueDiligenceTasks.map(task => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        completedAt: task.completedAt ? new Date(task.completedAt) : null,
        createdAt: new Date(task.createdAt)
      }))
    }
  } catch (error) {
    console.error('Error fetching transaction via API:', error)
    return null
  }
})

// Get due diligence progress with task analytics
export const getDueDiligenceProgress = cache(async () => {
  try {
    const transaction = await getTransaction()
    if (!transaction) return null

    const tasks = transaction.dueDiligenceTasks
    const completed = tasks.filter(t => t.status === 'completed').length
    const inProgress = tasks.filter(t => t.status === 'in-progress').length
    const pending = tasks.filter(t => t.status === 'pending').length
    const blocked = tasks.filter(t => t.status === 'blocked').length

    return {
      tasks,
      summary: {
        total: tasks.length,
        completed,
        inProgress,
        pending,
        blocked,
        completionRate: (completed / tasks.length) * 100,
      }
    }
  } catch (error) {
    console.error('Error fetching due diligence progress via API:', error)
    return null
  }
})

// API Health Check
export const checkAPIHealth = cache(async () => {
  try {
    return await apiClient.healthCheck()
  } catch (error) {
    console.error('API health check failed:', error)
    return false
  }
})