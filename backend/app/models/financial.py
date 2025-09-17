from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Numeric, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class FinancialMetric(Base):
    __tablename__ = "financial_metrics"

    id = Column(String, primary_key=True, index=True)
    date = Column(DateTime, nullable=False)
    revenue = Column(Numeric, nullable=False)
    cogs = Column(Numeric, nullable=False)  # Cost of Goods Sold
    gross_profit = Column("grossProfit", Numeric, nullable=False)
    opex = Column(Numeric, nullable=False)  # Operating Expenses
    ebitda = Column(Numeric, nullable=False)
    net_income = Column("netIncome", Numeric, nullable=False)
    cash_flow = Column("cashFlow", Numeric, nullable=False)

    organization_id = Column("organizationId", String, ForeignKey("organizations.id"))

    # Relationships
    organization = relationship("Organization", back_populates="financial_metrics")

    __table_args__ = (
        UniqueConstraint("organizationId", "date", name="unique_org_date"),
    )


class ModelScenario(Base):
    __tablename__ = "model_scenarios"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, default="custom")  # 'base', 'optimistic', 'pessimistic', 'custom'
    description = Column(String, nullable=True)

    # Assumptions
    revenue_growth = Column("revenueGrowth", Numeric, nullable=False)
    margin_improvement = Column("marginImprovement", Numeric, nullable=False)
    working_capital_days = Column("workingCapitalDays", Integer, nullable=False)
    capex_as_percent_revenue = Column("capexAsPercentRevenue", Numeric, default=0)

    organization_id = Column("organizationId", String, ForeignKey("organizations.id"))
    created_at = Column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updatedAt", DateTime(timezone=True), onupdate=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="model_scenarios")
    projections = relationship("ModelProjection", back_populates="scenario", cascade="all, delete-orphan")


class ModelProjection(Base):
    __tablename__ = "model_projections"

    id = Column(String, primary_key=True, index=True)
    date = Column(DateTime, nullable=False)
    revenue = Column(Numeric, nullable=False)
    cogs = Column(Numeric, nullable=False)
    gross_profit = Column("grossProfit", Numeric, nullable=False)
    opex = Column(Numeric, nullable=False)
    ebitda = Column(Numeric, nullable=False)
    net_income = Column("netIncome", Numeric, nullable=False)
    cash_flow = Column("cashFlow", Numeric, nullable=False)

    scenario_id = Column("scenarioId", String, ForeignKey("model_scenarios.id"))

    # Relationships
    scenario = relationship("ModelScenario", back_populates="projections")

    __table_args__ = (
        UniqueConstraint("scenarioId", "date", name="unique_scenario_date"),
    )