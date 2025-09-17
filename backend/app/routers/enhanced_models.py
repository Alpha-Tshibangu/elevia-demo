"""
Enhanced Financial Models API with Bloomberg Integration

Provides sophisticated financial modeling capabilities with real market data integration.
This demonstrates institutional-grade quantitative finance and risk management tools.
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict
import logging

from ..services.enhanced_modeling import generate_bloomberg_enhanced_scenarios
from ..services.market_data import market_data_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/enhanced-scenarios/")
async def get_enhanced_scenarios() -> List[Dict]:
    """
    Get sophisticated financial scenarios enhanced with Bloomberg-style market data

    Features:
    - Real market volatility integration
    - Market regime awareness (Bull/Bear/Sideways)
    - Correlation modeling with market indices
    - Risk-adjusted projections with Sharpe ratios
    - Monte Carlo simulation with fat-tail distributions
    - Advanced analytics (max drawdown, volatility clustering)
    """
    try:
        logger.info("🚀 API: Generating Bloomberg-enhanced scenarios")
        scenarios = await generate_bloomberg_enhanced_scenarios()

        logger.info(f"✅ API: Generated {len(scenarios)} enhanced scenarios with market data")
        return scenarios

    except Exception as e:
        logger.error(f"❌ API: Error generating enhanced scenarios: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate enhanced scenarios: {str(e)}")

@router.get("/market-data/volatility")
async def get_market_volatility(symbols: str = "SPY,QQQ,IWM") -> Dict[str, float]:
    """
    Get real-time market volatility for specified symbols
    Bloomberg equivalent: RVOL function
    """
    try:
        symbol_list = [s.strip().upper() for s in symbols.split(",")]

        async with market_data_service:
            volatilities = await market_data_service.get_market_volatility(symbol_list)

        logger.info(f"✅ API: Retrieved volatility for {len(symbol_list)} symbols")
        return volatilities

    except Exception as e:
        logger.error(f"❌ API: Error fetching volatility: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch volatility: {str(e)}")

@router.get("/market-data/regime")
async def get_market_regime() -> Dict:
    """
    Get current market regime analysis
    Bloomberg equivalent: Market regime indicators
    """
    try:
        async with market_data_service:
            regime = await market_data_service.get_market_regime()

        logger.info(f"✅ API: Current market regime: {regime['regime']}")
        return regime

    except Exception as e:
        logger.error(f"❌ API: Error analyzing market regime: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze market regime: {str(e)}")

@router.get("/market-data/risk-free-rate")
async def get_risk_free_rate() -> Dict[str, float]:
    """
    Get current risk-free rate (10-year Treasury yield)
    Bloomberg equivalent: USGG10YR
    """
    try:
        async with market_data_service:
            rate = await market_data_service.get_risk_free_rate()

        logger.info(f"✅ API: Risk-free rate: {rate:.2%}")
        return {"risk_free_rate": rate, "source": "10Y_Treasury"}

    except Exception as e:
        logger.error(f"❌ API: Error fetching risk-free rate: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch risk-free rate: {str(e)}")

@router.get("/market-data/sector-performance")
async def get_sector_performance() -> Dict[str, float]:
    """
    Get sector performance analysis
    Bloomberg equivalent: Sector rotation analysis
    """
    try:
        async with market_data_service:
            performance = await market_data_service.get_sector_performance()

        logger.info(f"✅ API: Retrieved performance for {len(performance)} sectors")
        return performance

    except Exception as e:
        logger.error(f"❌ API: Error fetching sector performance: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch sector performance: {str(e)}")