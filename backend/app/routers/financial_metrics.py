from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import datetime, date

from app.core.database import get_db
from app.models.organization import Organization
from app.models.financial import FinancialMetric, ModelScenario
from app.schemas.financial import (
    FinancialMetricsResponse,
    FinancialMetricResponse,
    ModelScenarioResponse,
    FinancialSummary
)

router = APIRouter()


@router.get("/", response_model=Optional[FinancialMetricsResponse])
async def get_financial_metrics(
    months: int = Query(24, description="Number of months to retrieve"),
    db: Session = Depends(get_db)
):
    """Get financial metrics with calculations and summary"""

    # Get the organization
    org = db.query(Organization).first()
    if not org:
        return None

    # Get financial metrics
    metrics = db.query(FinancialMetric)\
        .filter(FinancialMetric.organization_id == org.id)\
        .order_by(FinancialMetric.date.desc())\
        .limit(months)\
        .all()

    if not metrics:
        return None

    # Convert to response format with float conversion
    converted_metrics = []
    for metric in metrics:
        converted_metrics.append(FinancialMetricResponse(
            id=metric.id,
            date=metric.date,
            revenue=float(metric.revenue),
            cogs=float(metric.cogs),
            grossProfit=float(metric.gross_profit),
            opex=float(metric.opex),
            ebitda=float(metric.ebitda),
            netIncome=float(metric.net_income),
            cashFlow=float(metric.cash_flow)
        ))

    # Calculate aggregates
    latest_metric = metrics[0] if metrics else None
    previous_metric = metrics[1] if len(metrics) > 1 else None
    year_ago_metric = metrics[11] if len(metrics) > 11 else None

    # Filter current year metrics
    current_year = datetime.now().year
    current_year_metrics = [m for m in metrics if m.date.year == current_year]

    # Create summary
    summary = FinancialSummary(
        total_revenue=float(latest_metric.revenue) if latest_metric else 0,
        total_ebitda=float(latest_metric.ebitda) if latest_metric else 0,
        total_cash_flow=float(latest_metric.cash_flow) if latest_metric else 0,
        gross_margin=(float(latest_metric.gross_profit) / float(latest_metric.revenue) * 100) if latest_metric and latest_metric.revenue else 0,
        month_over_month=((float(latest_metric.revenue) - float(previous_metric.revenue)) / float(previous_metric.revenue) * 100) if latest_metric and previous_metric and previous_metric.revenue else 0,
        year_over_year=((float(latest_metric.revenue) - float(year_ago_metric.revenue)) / float(year_ago_metric.revenue) * 100) if latest_metric and year_ago_metric and year_ago_metric.revenue else 0,
        ytd_revenue=sum(float(m.revenue) for m in current_year_metrics),
        ytd_ebitda=sum(float(m.ebitda) for m in current_year_metrics)
    )

    latest_converted = converted_metrics[0] if converted_metrics else None

    return FinancialMetricsResponse(
        metrics=list(reversed(converted_metrics)),  # Chronological order
        latest=latest_converted,
        summary=summary
    )


@router.get("/scenarios", response_model=List[ModelScenarioResponse])
async def get_model_scenarios(db: Session = Depends(get_db)):
    """Get model scenarios with projections"""

    # Get the organization
    org = db.query(Organization).first()
    if not org:
        return []

    # Get scenarios with projections
    scenarios = db.query(ModelScenario)\
        .filter(ModelScenario.organization_id == org.id)\
        .options(joinedload(ModelScenario.projections))\
        .all()

    # Sort scenarios with base case first
    def scenario_sort_key(scenario):
        type_order = {'base': 0, 'optimistic': 1, 'pessimistic': 2}
        return type_order.get(scenario.type, 3)

    scenarios.sort(key=scenario_sort_key)

    # Convert to response format
    converted_scenarios = []
    for scenario in scenarios:
        # Convert projections
        converted_projections = []
        for projection in sorted(scenario.projections, key=lambda p: p.date):
            converted_projections.append({
                'id': projection.id,
                'date': projection.date,
                'revenue': float(projection.revenue),
                'cogs': float(projection.cogs),
                'grossProfit': float(projection.gross_profit),
                'opex': float(projection.opex),
                'ebitda': float(projection.ebitda),
                'netIncome': float(projection.net_income),
                'cashFlow': float(projection.cash_flow)
            })

        converted_scenarios.append(ModelScenarioResponse(
            id=scenario.id,
            name=scenario.name,
            type=scenario.type,
            description=scenario.description,
            revenueGrowth=float(scenario.revenue_growth),
            marginImprovement=float(scenario.margin_improvement),
            workingCapitalDays=scenario.working_capital_days,
            capexAsPercentRevenue=float(scenario.capex_as_percent_revenue),
            projections=converted_projections
        ))

    return converted_scenarios