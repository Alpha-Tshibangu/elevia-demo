"""
Enhanced Financial Modeling Engine with Bloomberg-style Market Intelligence

This module provides sophisticated financial modeling capabilities that integrate
real market data, volatility analysis, and regime-aware projections.
Designed to demonstrate institutional-grade quantitative finance capabilities.
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

from .market_data import get_enhanced_scenario_parameters, market_data_service

logger = logging.getLogger(__name__)

class EnhancedFinancialModelingEngine:
    """
    Sophisticated financial modeling engine with market data integration
    """

    def __init__(self):
        self.scaler = StandardScaler()
        self.pca = PCA(n_components=3)

    async def generate_market_aware_scenarios(self, base_revenue: float = 2500000) -> List[Dict]:
        """
        Generate sophisticated scenario projections using real market data

        This demonstrates Bloomberg-style quantitative modeling capabilities:
        - Market regime awareness
        - Volatility clustering
        - Correlation modeling
        - Risk-adjusted projections
        """
        logger.info("🔬 Generating market-aware scenario projections")

        # Get enhanced market parameters
        market_params = await get_enhanced_scenario_parameters()

        scenarios = []
        scenario_configs = [
            {
                "type": "base",
                "name": "Base Case (Market-Adjusted)",
                "params": market_params["base_case"]
            },
            {
                "type": "optimistic",
                "name": "Bull Case (Market-Driven)",
                "params": market_params["bull_case"]
            },
            {
                "type": "pessimistic",
                "name": "Bear Case (Risk-Adjusted)",
                "params": market_params["bear_case"]
            }
        ]

        for scenario_config in scenario_configs:
            scenario = await self._generate_sophisticated_projections(
                scenario_config, base_revenue, market_params["market_context"]
            )
            scenarios.append(scenario)

        logger.info(f"✅ Generated {len(scenarios)} market-aware scenarios")
        return scenarios

    async def _generate_sophisticated_projections(
        self, scenario_config: Dict, base_revenue: float, market_context: Dict
    ) -> Dict:
        """
        Generate sophisticated financial projections with advanced modeling
        """
        params = scenario_config["params"]
        projections = []

        # Initial values
        current_revenue = base_revenue

        # Market regime adjustments
        regime = market_context["regime"]
        regime_vol_multiplier = {"BULL": 0.8, "BEAR": 1.4, "SIDEWAYS": 1.0}.get(regime, 1.0)

        logger.info(f"📊 Modeling {scenario_config['name']} for {regime} market regime")

        for month in range(36):  # 3-year projections
            # Advanced growth modeling with multiple factors
            base_growth = params["revenue_growth"] / 12  # Monthly growth

            # 1. Seasonal effects (retail seasonality)
            seasonal_factor = 1 + 0.15 * np.sin(2 * np.pi * month / 12 + np.pi/2)

            # 2. Market volatility clustering (GARCH-like)
            volatility = params["volatility_factor"] * regime_vol_multiplier
            if month > 0:
                # Volatility clustering: high vol periods tend to cluster
                prev_shock = projections[month-1].get("volatility_shock", 0)
                volatility *= (1 + 0.3 * abs(prev_shock))

            # 3. Monte Carlo shock with fat tails (Student's t-distribution)
            degrees_freedom = 5  # Creates fat tails
            volatility_shock = np.random.standard_t(degrees_freedom) * volatility / 12

            # 4. Mean reversion component
            deviation_from_trend = (current_revenue - base_revenue * (1 + base_growth * month)) / base_revenue
            mean_reversion = -0.1 * deviation_from_trend

            # 5. Market correlation component
            market_shock = np.random.normal(0, market_context["market_volatility"] / 12)
            correlated_shock = params["market_correlation"] * market_shock

            # Combined growth rate
            total_growth = (base_growth + volatility_shock + mean_reversion +
                          correlated_shock) * seasonal_factor

            # Update revenue
            current_revenue *= (1 + total_growth)

            # Sophisticated margin modeling
            base_margin = 0.35
            margin_improvement = params.get("margin_improvement", 0) / 36  # Gradual improvement
            margin_volatility = 0.02 * np.random.normal()

            # Operating leverage effect
            revenue_growth_rate = total_growth * 12  # Annualized
            operating_leverage = 1.5  # 1.5x operating leverage
            margin_from_leverage = revenue_growth_rate * operating_leverage * 0.1

            margin = base_margin + margin_improvement + margin_volatility + margin_from_leverage
            margin = np.clip(margin, 0.15, 0.65)  # Reasonable bounds

            # Calculate financial metrics
            revenue = int(current_revenue)
            cogs = int(revenue * (1 - margin))
            gross_profit = revenue - cogs

            # OpEx with economies of scale
            base_opex_rate = 0.25
            scale_benefit = min(0.05, (revenue / base_revenue - 1) * 0.02)
            opex_rate = base_opex_rate - scale_benefit
            opex = int(revenue * opex_rate)

            ebitda = gross_profit - opex

            # Tax and interest calculations
            interest_rate = market_context["risk_free_rate"] + 0.02  # Credit spread
            interest_expense = int(revenue * 0.05 * interest_rate)  # Assume 5% debt/revenue ratio
            ebt = ebitda - interest_expense
            tax_rate = 0.25
            net_income = int(ebt * (1 - tax_rate)) if ebt > 0 else int(ebt * 0.1)  # Loss carry-forward

            # Cash flow with working capital
            working_capital_change = int(revenue * 0.02 * np.random.normal())
            capex = int(revenue * 0.035)  # 3.5% capex rate
            cash_flow = net_income + capex - working_capital_change  # Simplified FCF

            date = datetime.now() + timedelta(days=30 * (month + 1))

            projection = {
                "id": f"proj-{scenario_config['type']}-{month}",
                "date": date.isoformat(),
                "revenue": revenue,
                "cogs": cogs,
                "grossProfit": gross_profit,
                "opex": opex,
                "ebitda": ebitda,
                "netIncome": net_income,
                "cashFlow": cash_flow,
                "scenarioId": f"scenario-{scenario_config['type']}",
                # Additional Bloomberg-style metrics
                "ebitdaMargin": ebitda / revenue if revenue > 0 else 0,
                "volatility_shock": volatility_shock,
                "market_correlation": params["market_correlation"],
                "seasonal_factor": seasonal_factor
            }

            projections.append(projection)

        # Calculate scenario summary statistics
        total_revenue_growth = (projections[-1]["revenue"] / projections[0]["revenue"] - 1)
        avg_margin = np.mean([p["ebitdaMargin"] for p in projections])
        volatility_realized = np.std([p["revenue"] for p in projections]) / np.mean([p["revenue"] for p in projections])

        scenario = {
            "id": f"scenario-{scenario_config['type']}",
            "name": scenario_config["name"],
            "type": scenario_config["type"],
            "description": f"{scenario_config['name']} with {regime} market regime adjustment",
            "revenueGrowth": params["revenue_growth"],
            "marginImprovement": params.get("margin_improvement", 0.02),
            "workingCapitalDays": 45,
            "capexAsPercentRevenue": 0.035,
            "organizationId": "1",
            "projections": projections,
            # Bloomberg-style analytics
            "analytics": {
                "total_revenue_growth": total_revenue_growth,
                "average_ebitda_margin": avg_margin,
                "realized_volatility": volatility_realized,
                "market_regime": regime,
                "confidence_interval": params["confidence_interval"],
                "sharpe_ratio": self._calculate_sharpe_ratio(projections, market_context["risk_free_rate"]),
                "max_drawdown": self._calculate_max_drawdown([p["ebitda"] for p in projections])
            }
        }

        return scenario

    def _calculate_sharpe_ratio(self, projections: List[Dict], risk_free_rate: float) -> float:
        """Calculate Sharpe ratio for the projection series"""
        try:
            ebitda_series = [p["ebitda"] for p in projections]
            returns = np.diff(ebitda_series) / ebitda_series[:-1]
            excess_returns = np.mean(returns) * 12 - risk_free_rate  # Annualized
            return excess_returns / (np.std(returns) * np.sqrt(12)) if np.std(returns) > 0 else 0
        except:
            return 0.0

    def _calculate_max_drawdown(self, series: List[float]) -> float:
        """Calculate maximum drawdown"""
        try:
            peaks = np.maximum.accumulate(series)
            drawdowns = (peaks - series) / peaks
            return float(np.max(drawdowns))
        except:
            return 0.0

# Global modeling engine instance
enhanced_modeling_engine = EnhancedFinancialModelingEngine()

async def generate_bloomberg_enhanced_scenarios() -> List[Dict]:
    """
    Main function to generate Bloomberg-style enhanced scenarios
    """
    logger.info("🚀 Generating Bloomberg-enhanced financial scenarios")

    scenarios = await enhanced_modeling_engine.generate_market_aware_scenarios()

    # Log analytics for demonstration
    for scenario in scenarios:
        analytics = scenario.get("analytics", {})
        logger.info(f"📈 {scenario['name']}: "
                   f"Sharpe: {analytics.get('sharpe_ratio', 0):.2f}, "
                   f"Max DD: {analytics.get('max_drawdown', 0):.1%}, "
                   f"Volatility: {analytics.get('realized_volatility', 0):.1%}")

    return scenarios