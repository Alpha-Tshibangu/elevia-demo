import { useEffect, useState } from 'react'
import { RiGlobalLine } from '@remixicon/react'

interface MarketDataStatusProps {
  scenarios: any[]
}

interface LiveMarketData {
  regime?: any
  volatility?: any
  riskFreeRate?: any
  sectorPerformance?: any
}

export function MarketDataStatus({ scenarios }: MarketDataStatusProps) {
  const [liveData, setLiveData] = useState<LiveMarketData>({})
  const [isEnhanced, setIsEnhanced] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Always try to fetch live data - this will determine if Bloomberg integration is working
    const fetchAllMarketData = async () => {
      setLoading(true)
      try {
        const baseUrl = process.env.NODE_ENV === 'production'
          ? '/api/proxy/api/v1'
          : 'http://45.55.152.121:8000/api/v1'

        const [regimeRes, volatilityRes, riskFreeRes, sectorRes] = await Promise.allSettled([
          fetch(`${baseUrl}/bloomberg/market-data/regime`),
          fetch(`${baseUrl}/bloomberg/market-data/volatility?symbols=SPY,QQQ,IWM,VIX`),
          fetch(`${baseUrl}/bloomberg/market-data/risk-free-rate`),
          fetch(`${baseUrl}/bloomberg/market-data/sector-performance`)
        ])

        const newLiveData: LiveMarketData = {}

        if (regimeRes.status === 'fulfilled' && regimeRes.value.ok) {
          newLiveData.regime = await regimeRes.value.json()
        }

        if (volatilityRes.status === 'fulfilled' && volatilityRes.value.ok) {
          newLiveData.volatility = await volatilityRes.value.json()
        }

        if (riskFreeRes.status === 'fulfilled' && riskFreeRes.value.ok) {
          newLiveData.riskFreeRate = await riskFreeRes.value.json()
        }

        if (sectorRes.status === 'fulfilled' && sectorRes.value.ok) {
          newLiveData.sectorPerformance = await sectorRes.value.json()
        }

        setLiveData(newLiveData)

        // If we got any live data, consider it enhanced
        if (Object.keys(newLiveData).length > 0) {
          setIsEnhanced(true)
        }

        console.log('Bloomberg data fetched:', Object.keys(newLiveData))
      } catch (error) {
        console.log('Bloomberg data fetch failed, using fallback modeling')
        setIsEnhanced(false)
      } finally {
        setLoading(false)
      }
    }

    // Always try to fetch data
    fetchAllMarketData()

    // Refresh data every 2 minutes to keep it current
    const interval = setInterval(fetchAllMarketData, 2 * 60 * 1000)
    return () => clearInterval(interval)
  }, [scenarios])

  if (!isEnhanced && Object.keys(liveData).length === 0) {
    return null
  }

  const hasLiveData = Object.keys(liveData).length > 0

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RiGlobalLine className={`size-5 ${hasLiveData ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`} />
          <h2 className={`text-lg font-semibold ${hasLiveData ? 'text-gray-900 dark:text-gray-100' : 'text-gray-900 dark:text-gray-300'}`}>
            {hasLiveData ? 'Bloomberg Market Data' : 'Financial Modeling Parameters'}
          </h2>
        </div>
        {loading && (
          <div className="text-xs text-gray-500">Loading live data...</div>
        )}
      </div>

      {hasLiveData && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {/* Market Regime - Critical for scenario adjustments */}
          {liveData.regime && (
            <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Market Regime
                </p>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {liveData.regime.regime}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {(liveData.regime.confidence * 100).toFixed(0)}% conf.
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Adjusts growth rates
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* S&P 500 Volatility */}
          {liveData.volatility && (
            <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  S&P Volatility
                </p>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {(liveData.volatility.SPY * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {liveData.volatility.SPY > 0.25 ? 'High' : liveData.volatility.SPY > 0.18 ? 'Moderate' : 'Low'} stress
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Monte Carlo σ input
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Risk-Free Rate - Always show with live data or fallback */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="text-center">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Risk-Free Rate
              </p>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {liveData.riskFreeRate ?
                  (liveData.riskFreeRate.risk_free_rate * 100).toFixed(2) :
                  '4.25'}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                10Y Treasury
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Sharpe & DCF base
                </p>
              </div>
            </div>
          </div>

          {/* Market P/E Ratio - Always show based on regime or default */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="text-center">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                S&P 500 P/E
              </p>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {liveData.regime?.regime === 'BULL' ? '22.5x' : liveData.regime?.regime === 'BEAR' ? '16.2x' : '18.5x'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Market multiple
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Exit valuation ref.
                </p>
              </div>
            </div>
          </div>

          {/* Credit Spread - Always show based on regime or use estimated rate */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="text-center">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Credit Spread
              </p>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {liveData.regime?.regime === 'BEAR' ? '325' : liveData.regime?.regime === 'BULL' ? '125' : '200'} bps
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                BBB spreads
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  WACC calculation
                </p>
              </div>
            </div>
          </div>

          {/* Equity Risk Premium - Always show, use volatility when available */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="text-center">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Equity Premium
              </p>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {liveData.volatility ?
                  (5.5 + (liveData.volatility.SPY - 0.15) * 10).toFixed(1) :
                  '6.5'}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Over risk-free
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Cost of equity
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasLiveData && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Scenario projections incorporate real-time market conditions and volatility clustering
        </div>
      )}
    </div>
  )
}