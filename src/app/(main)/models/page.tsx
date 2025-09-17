'use client'

import { useState, useEffect } from 'react'
import { getModelScenarios, getFinancialMetrics } from "@/lib/api-bridge"
import { ModelsClient } from "./ModelsClient"
import { ModelsSkeleton } from "@/components/ui/skeletons/ModelsSkeleton"

export default function Models() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<{
    scenarios: any
    financialData: any
  } | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [scenarios, financialData] = await Promise.all([
          getModelScenarios(),
          getFinancialMetrics()
        ])

        setData({ scenarios, financialData })
      } catch (error) {
        console.error('Error fetching models data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <ModelsSkeleton />
  }

  if (!data?.scenarios || !data?.financialData) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Loading financial models...</p>
      </div>
    )
  }

  return <ModelsClient scenarios={data.scenarios} historicalData={data.financialData.metrics} />
}