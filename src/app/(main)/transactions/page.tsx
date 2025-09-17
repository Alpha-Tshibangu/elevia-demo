'use client'

import { useState, useEffect } from 'react'
import { DealMetrics } from "@/components/ui/transactions/DealMetrics"
import { DueDiligenceTracker } from "@/components/ui/transactions/DueDiligenceTracker"
import { TransactionsSkeleton } from "@/components/ui/skeletons/TransactionsSkeleton"
import { getTransaction, getDueDiligenceProgress } from "@/lib/local-api"
import { getFinancialMetrics } from "@/lib/api-bridge"
import { FinancialStatementsTable } from "@/components/ui/reports/FinancialStatementsTable"

export default function Transactions() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<{
    transaction: any
    dueDiligenceData: any
    financialData: any
  } | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [transaction, dueDiligenceData, financialData] = await Promise.all([
          getTransaction(),
          getDueDiligenceProgress(),
          getFinancialMetrics()
        ])

        setData({ transaction, dueDiligenceData, financialData })
      } catch (error) {
        console.error('Error fetching transaction data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <TransactionsSkeleton />
  }

  if (!data?.transaction) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No transaction data found. Please check your API connection.</p>
      </div>
    )
  }

  const { transaction, dueDiligenceData, financialData } = data

  const dealMetrics = {
    valuation: transaction.valuation ? `$${(transaction.valuation / 1000000).toFixed(0)}M` : 'N/A',
    multiple: transaction.multiple || 'N/A',
    irr: transaction.irr ? `${transaction.irr}%` : 'N/A',
    payback: transaction.paybackYears ? `${transaction.paybackYears} years` : 'N/A',
  }

  const dueDiligenceItems = (dueDiligenceData?.tasks || []).map((task: any) => ({
    task: task.task,
    status: task.status as "pending" | "completed" | "in-progress",
    assignee: task.assignee?.name || 'Unassigned',
  }))

  return (
    <>
      <section aria-labelledby="transaction-readiness">
        <h1
          id="transaction-readiness"
          className="scroll-mt-10 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
        >
          Transaction Readiness
        </h1>
        
        <div className="mt-8">
          <DealMetrics metrics={dealMetrics} />
        </div>
      </section>

      <section aria-labelledby="due-diligence" className="mt-12">
        <h2
          id="due-diligence"
          className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
        >
          Due Diligence Progress
        </h2>
        <div className="mt-6">
          <DueDiligenceTracker items={dueDiligenceItems} />
        </div>
      </section>

      <section aria-labelledby="financial-statements" className="mt-12">
        <h2
          id="financial-statements"
          className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
        >
          Financial Statements
        </h2>
        <div className="mt-6">
          <FinancialStatementsTable data={financialData.metrics.slice(-12)} />
        </div>
      </section>
    </>
  )
}