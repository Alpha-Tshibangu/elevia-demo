from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    logo = Column(String, nullable=True)
    created_at = Column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updatedAt", DateTime(timezone=True), onupdate=func.now())

    # Relationships
    transactions = relationship("Transaction", back_populates="organization")
    transaction_docs = relationship("TransactionDocument", back_populates="organization")
    financial_metrics = relationship("FinancialMetric", back_populates="organization")
    model_scenarios = relationship("ModelScenario", back_populates="organization")
    reports = relationship("Report", back_populates="organization")
    data_sources = relationship("DataSource", back_populates="organization")