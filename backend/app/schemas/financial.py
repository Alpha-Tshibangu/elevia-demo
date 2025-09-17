from typing import List, Optional
from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, Field


class FinancialMetricResponse(BaseModel):
    id: str
    date: datetime
    revenue: float
    cogs: float
    gross_profit: float = Field(alias="grossProfit")
    opex: float
    ebitda: float
    net_income: float = Field(alias="netIncome")
    cash_flow: float = Field(alias="cashFlow")

    class Config:
        from_attributes = True
        allow_population_by_field_name = True


class ModelProjectionResponse(BaseModel):
    id: str
    date: datetime
    revenue: float
    cogs: float
    gross_profit: float = Field(alias="grossProfit")
    opex: float
    ebitda: float
    net_income: float = Field(alias="netIncome")
    cash_flow: float = Field(alias="cashFlow")

    class Config:
        from_attributes = True
        allow_population_by_field_name = True


class ModelScenarioResponse(BaseModel):
    id: str
    name: str
    type: str
    description: Optional[str]
    revenue_growth: float = Field(alias="revenueGrowth")
    margin_improvement: float = Field(alias="marginImprovement")
    working_capital_days: int = Field(alias="workingCapitalDays")
    capex_as_percent_revenue: float = Field(alias="capexAsPercentRevenue")
    projections: List[ModelProjectionResponse] = []

    class Config:
        from_attributes = True
        allow_population_by_field_name = True


class FinancialSummary(BaseModel):
    total_revenue: float
    total_ebitda: float
    total_cash_flow: float
    gross_margin: float
    month_over_month: float
    year_over_year: float
    ytd_revenue: float
    ytd_ebitda: float


class FinancialMetricsResponse(BaseModel):
    metrics: List[FinancialMetricResponse]
    latest: Optional[FinancialMetricResponse]
    summary: FinancialSummary