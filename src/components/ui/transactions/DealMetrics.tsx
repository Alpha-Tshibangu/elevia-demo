interface DealMetricsProps {
  metrics: {
    valuation: string
    multiple: string
    irr: string
    payback: string
  }
}

export function DealMetrics({ metrics }: DealMetricsProps) {
  const cards = [
    {
      title: "Valuation",
      value: metrics.valuation,
      description: "Enterprise value",
    },
    {
      title: "Multiple",
      value: metrics.multiple,
      description: "Based on TTM EBITDA",
    },
    {
      title: "Expected IRR",
      value: metrics.irr,
      description: "5-year projection",
    },
    {
      title: "Payback Period",
      value: metrics.payback,
      description: "Investment recovery",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-500">
              {card.title}
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">
              {card.value}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {card.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}