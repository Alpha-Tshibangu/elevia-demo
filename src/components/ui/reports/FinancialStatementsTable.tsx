import { cx } from "@/lib/utils"

interface FinancialMetric {
  date: Date
  revenue: number
  cogs: number
  grossProfit: number
  opex: number
  ebitda: number
  netIncome: number
  cashFlow: number
}

interface FinancialStatementsTableProps {
  data: FinancialMetric[]
}

export function FinancialStatementsTable({ data }: FinancialStatementsTableProps) {
  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}K`
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  // Transform data to include calculated margins
  const enrichedData = data.map(row => ({
    ...row,
    grossMargin: row.revenue > 0 ? row.grossProfit / row.revenue : 0,
    ebitdaMargin: row.revenue > 0 ? row.ebitda / row.revenue : 0,
    netMargin: row.revenue > 0 ? row.netIncome / row.revenue : 0,
  }))

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Period
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Revenue
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Gross Profit
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                EBITDA
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Net Income
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Gross Margin
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                EBITDA Margin
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
            {enrichedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-50">
                  {formatDate(row.date)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900 dark:text-gray-50">
                  {formatCurrency(row.revenue)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900 dark:text-gray-50">
                  {formatCurrency(row.grossProfit)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900 dark:text-gray-50">
                  {formatCurrency(row.ebitda)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900 dark:text-gray-50">
                  {formatCurrency(row.netIncome)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                  <span
                    className={cx(
                      "font-medium",
                      row.grossMargin >= 0.4
                        ? "text-emerald-600 dark:text-emerald-500"
                        : row.grossMargin >= 0.3
                        ? "text-blue-600 dark:text-blue-500"
                        : "text-amber-600 dark:text-amber-500",
                    )}
                  >
                    {formatPercentage(row.grossMargin)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                  <span
                    className={cx(
                      "font-medium",
                      row.ebitdaMargin >= 0.2
                        ? "text-emerald-600 dark:text-emerald-500"
                        : row.ebitdaMargin >= 0.15
                        ? "text-blue-600 dark:text-blue-500"
                        : "text-amber-600 dark:text-amber-500",
                    )}
                  >
                    {formatPercentage(row.ebitdaMargin)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}