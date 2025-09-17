"""
Bloomberg-style Market Data Service for Enhanced Financial Modeling

This service provides sophisticated market data capabilities similar to Bloomberg Terminal,
including real-time pricing, historical volatility, correlation analysis, and risk metrics.
Designed to enhance financial modeling with professional-grade market intelligence.
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import numpy as np
import pandas as pd
import yfinance as yf
from asyncio_throttle import Throttler
import aiohttp

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MarketDataService:
    """
    Professional market data service providing Bloomberg-style capabilities
    """

    def __init__(self):
        self.throttler = Throttler(rate_limit=10, period=1)  # 10 requests per second
        self.cache = {}
        self.cache_expiry = {}
        self.session = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    def _is_cache_valid(self, key: str, cache_duration: int = 300) -> bool:
        """Check if cached data is still valid (default 5 minutes)"""
        return (key in self.cache and
                key in self.cache_expiry and
                datetime.now() < self.cache_expiry[key])

    def _cache_data(self, key: str, data, cache_duration: int = 300):
        """Cache data with expiry"""
        self.cache[key] = data
        self.cache_expiry[key] = datetime.now() + timedelta(seconds=cache_duration)

    async def get_market_volatility(self, symbols: List[str], period: str = "1y") -> Dict[str, float]:
        """
        Calculate market volatility for given symbols (Bloomberg RVOL equivalent)

        Args:
            symbols: List of ticker symbols (e.g., ['SPY', 'QQQ', 'IWM'])
            period: Time period ('1m', '5m', '1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max')

        Returns:
            Dictionary mapping symbols to annualized volatility
        """
        cache_key = f"volatility_{'+'.join(symbols)}_{period}"
        if self._is_cache_valid(cache_key):
            return self.cache[cache_key]

        async with self.throttler:
            logger.info(f"📊 Fetching market volatility for {symbols} ({period})")

            volatilities = {}

            for symbol in symbols:
                try:
                    ticker = yf.Ticker(symbol)
                    hist = ticker.history(period=period)

                    if len(hist) > 20:  # Need sufficient data points
                        # Calculate daily returns
                        returns = hist['Close'].pct_change().dropna()

                        # Annualized volatility (252 trading days)
                        volatility = returns.std() * np.sqrt(252)
                        volatilities[symbol] = float(volatility)

                        logger.info(f"✅ {symbol}: {volatility:.2%} annual volatility")
                    else:
                        logger.warning(f"⚠️ Insufficient data for {symbol}")
                        volatilities[symbol] = 0.20  # Default 20% volatility

                except Exception as e:
                    logger.error(f"❌ Error fetching {symbol}: {e}")
                    volatilities[symbol] = 0.20  # Default fallback

            self._cache_data(cache_key, volatilities)
            return volatilities

    async def get_correlation_matrix(self, symbols: List[str], period: str = "1y") -> pd.DataFrame:
        """
        Generate correlation matrix for portfolio risk analysis (Bloomberg CORR equivalent)
        """
        cache_key = f"correlation_{'+'.join(symbols)}_{period}"
        if self._is_cache_valid(cache_key):
            return self.cache[cache_key]

        async with self.throttler:
            logger.info(f"🔗 Computing correlation matrix for {symbols}")

            try:
                # Download data for all symbols
                data = yf.download(symbols, period=period, group_by='ticker')

                if len(symbols) == 1:
                    # Single symbol case
                    returns = data['Close'].pct_change().dropna()
                    corr_matrix = pd.DataFrame([[1.0]], index=[symbols[0]], columns=[symbols[0]])
                else:
                    # Multiple symbols
                    returns_data = {}
                    for symbol in symbols:
                        if symbol in data.columns.levels[0]:
                            returns_data[symbol] = data[symbol]['Close'].pct_change()

                    returns_df = pd.DataFrame(returns_data).dropna()
                    corr_matrix = returns_df.corr()

                logger.info(f"✅ Generated {len(symbols)}x{len(symbols)} correlation matrix")
                self._cache_data(cache_key, corr_matrix)
                return corr_matrix

            except Exception as e:
                logger.error(f"❌ Error computing correlations: {e}")
                # Return identity matrix as fallback
                return pd.DataFrame(np.eye(len(symbols)), index=symbols, columns=symbols)

    async def get_risk_free_rate(self) -> float:
        """
        Get current risk-free rate (10-year Treasury yield - Bloomberg equivalent: USGG10YR)
        """
        cache_key = "risk_free_rate"
        if self._is_cache_valid(cache_key, cache_duration=3600):  # Cache for 1 hour
            return self.cache[cache_key]

        async with self.throttler:
            try:
                logger.info("📈 Fetching risk-free rate (10Y Treasury)")

                # Use 10-year Treasury ETF as proxy
                treasury = yf.Ticker("^TNX")
                hist = treasury.history(period="5d")

                if not hist.empty:
                    risk_free_rate = float(hist['Close'].iloc[-1]) / 100  # Convert percentage
                    logger.info(f"✅ Risk-free rate: {risk_free_rate:.2%}")
                else:
                    risk_free_rate = 0.045  # Default 4.5%
                    logger.warning("⚠️ Using default risk-free rate: 4.5%")

                self._cache_data(cache_key, risk_free_rate, cache_duration=3600)
                return risk_free_rate

            except Exception as e:
                logger.error(f"❌ Error fetching risk-free rate: {e}")
                return 0.045  # Default fallback

    async def get_market_regime(self) -> Dict[str, any]:
        """
        Analyze current market regime (Bull/Bear/Sideways) using multiple indicators
        Bloomberg equivalent: Market regime analysis
        """
        cache_key = "market_regime"
        if self._is_cache_valid(cache_key, cache_duration=1800):  # Cache for 30 minutes
            return self.cache[cache_key]

        async with self.throttler:
            try:
                logger.info("🔍 Analyzing market regime")

                # Analyze S&P 500 for market regime
                spy = yf.Ticker("SPY")
                hist = spy.history(period="6mo")

                if len(hist) > 50:
                    # Calculate moving averages
                    hist['MA_20'] = hist['Close'].rolling(20).mean()
                    hist['MA_50'] = hist['Close'].rolling(50).mean()

                    current_price = hist['Close'].iloc[-1]
                    ma_20 = hist['MA_20'].iloc[-1]
                    ma_50 = hist['MA_50'].iloc[-1]

                    # Calculate recent volatility
                    recent_returns = hist['Close'].pct_change().tail(20)
                    volatility = recent_returns.std() * np.sqrt(252)

                    # Determine regime
                    if current_price > ma_20 > ma_50 and volatility < 0.25:
                        regime = "BULL"
                        confidence = 0.8
                    elif current_price < ma_20 < ma_50 and volatility > 0.30:
                        regime = "BEAR"
                        confidence = 0.7
                    else:
                        regime = "SIDEWAYS"
                        confidence = 0.6

                    result = {
                        "regime": regime,
                        "confidence": confidence,
                        "volatility": float(volatility),
                        "trend_strength": float(abs(current_price - ma_50) / ma_50),
                        "price_vs_ma20": float((current_price - ma_20) / ma_20),
                        "timestamp": datetime.now().isoformat()
                    }

                    logger.info(f"✅ Market regime: {regime} (confidence: {confidence:.1%})")
                    self._cache_data(cache_key, result, cache_duration=1800)
                    return result

            except Exception as e:
                logger.error(f"❌ Error analyzing market regime: {e}")

            # Default fallback
            return {
                "regime": "SIDEWAYS",
                "confidence": 0.5,
                "volatility": 0.20,
                "trend_strength": 0.05,
                "price_vs_ma20": 0.0,
                "timestamp": datetime.now().isoformat()
            }

    async def get_sector_performance(self) -> Dict[str, float]:
        """
        Get sector performance data (Bloomberg equivalent: Sector analysis)
        """
        cache_key = "sector_performance"
        if self._is_cache_valid(cache_key, cache_duration=3600):
            return self.cache[cache_key]

        # Major sector ETFs
        sector_etfs = {
            "Technology": "XLK",
            "Healthcare": "XLV",
            "Financials": "XLF",
            "Consumer Discretionary": "XLY",
            "Communication Services": "XLC",
            "Industrials": "XLI",
            "Consumer Staples": "XLP",
            "Energy": "XLE",
            "Utilities": "XLU",
            "Real Estate": "XLRE",
            "Materials": "XLB"
        }

        async with self.throttler:
            logger.info("📊 Fetching sector performance data")

            performance = {}

            for sector, etf in sector_etfs.items():
                try:
                    ticker = yf.Ticker(etf)
                    hist = ticker.history(period="1mo")

                    if len(hist) > 5:
                        # Calculate 1-month performance
                        start_price = hist['Close'].iloc[0]
                        end_price = hist['Close'].iloc[-1]
                        perf = (end_price - start_price) / start_price
                        performance[sector] = float(perf)

                except Exception as e:
                    logger.warning(f"⚠️ Error fetching {sector} ({etf}): {e}")
                    performance[sector] = 0.0

            logger.info(f"✅ Retrieved performance for {len(performance)} sectors")
            self._cache_data(cache_key, performance, cache_duration=3600)
            return performance

# Global market data service instance
market_data_service = MarketDataService()

async def get_enhanced_scenario_parameters() -> Dict[str, any]:
    """
    Generate sophisticated scenario parameters using real market data
    This enhances our financial modeling with Bloomberg-style market intelligence
    """
    async with market_data_service:
        logger.info("🚀 Generating enhanced scenario parameters with market data")

        # Get market indicators
        market_vol = await market_data_service.get_market_volatility(["SPY", "QQQ", "IWM"])
        market_regime = await market_data_service.get_market_regime()
        risk_free_rate = await market_data_service.get_risk_free_rate()
        sector_performance = await market_data_service.get_sector_performance()

        # Calculate enhanced parameters
        spy_vol = market_vol.get("SPY", 0.20)
        regime_multiplier = {
            "BULL": 1.2,
            "BEAR": 0.7,
            "SIDEWAYS": 0.9
        }.get(market_regime["regime"], 1.0)

        # Enhanced scenario parameters
        parameters = {
            "base_case": {
                "revenue_growth": 0.12 * regime_multiplier,
                "volatility_factor": spy_vol * 0.8,
                "market_correlation": 0.6,
                "confidence_interval": 0.68
            },
            "bull_case": {
                "revenue_growth": 0.25 * regime_multiplier,
                "volatility_factor": spy_vol * 1.2,
                "market_correlation": 0.8,
                "confidence_interval": 0.90
            },
            "bear_case": {
                "revenue_growth": -0.05 * regime_multiplier,
                "volatility_factor": spy_vol * 1.5,
                "market_correlation": 0.9,
                "confidence_interval": 0.75
            },
            "market_context": {
                "regime": market_regime["regime"],
                "regime_confidence": market_regime["confidence"],
                "market_volatility": spy_vol,
                "risk_free_rate": risk_free_rate,
                "sector_rotation": sector_performance
            }
        }

        logger.info(f"✅ Generated enhanced parameters for {market_regime['regime']} market regime")
        return parameters