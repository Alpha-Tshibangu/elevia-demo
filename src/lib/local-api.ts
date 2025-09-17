import { cache } from 'react'

// Use proxy in production to avoid mixed content issues
// Check for Vercel deployment or production environment
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL
const FASTAPI_BASE_URL = isProduction
  ? '/api/proxy/api/v1'
  : 'http://45.55.152.121:8000/api/v1'

// Helper function for FastAPI calls with error handling and fast timeout
async function fastApiCall(endpoint: string, fallbackData: any = null) {
  try {
    console.log(`🐍 FastAPI Backend: Calling ${endpoint}`)

    // Create AbortController for 5-second timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`${FASTAPI_BASE_URL}${endpoint}`, {
      cache: 'no-store', // Always fetch fresh data to show backend processing
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.warn(`🚨 FastAPI Backend: ${endpoint} returned ${response.status}, using fallback`)
      return fallbackData
    }

    const data = await response.json()
    console.log(`✅ FastAPI Backend: Successfully processed ${endpoint} with quantitative modeling`)
    return data
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`🚨 FastAPI Backend: ${endpoint} timed out after 5s, using fallback`)
    } else {
      console.warn(`🚨 FastAPI Backend: ${endpoint} failed, using fallback:`, error)
    }
    return fallbackData
  }
}

// Cache user data for the request duration
export const getCurrentUser = cache(async () => {
  return await fastApiCall('/users', {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@elevia.com',
    role: 'analyst'
  })
})

// Get reports (now uses FastAPI backend)
export const getReports = cache(async () => {
  return await fastApiCall('/reports', { reports: [], summary: null })
})

// Get transaction with all related data (now uses FastAPI backend)
export const getTransaction = cache(async () => {
  return await fastApiCall('/transactions', null)
})

// Get due diligence progress (now uses FastAPI backend)
export const getDueDiligenceProgress = cache(async () => {
  return await fastApiCall('/transactions/due-diligence', null)
})