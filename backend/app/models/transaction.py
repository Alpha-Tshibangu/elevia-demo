from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    valuation = Column(Numeric, nullable=True)
    multiple = Column(String, nullable=True)  # e.g., "4.5x EBITDA"
    irr = Column(Numeric, nullable=True)  # Internal Rate of Return
    payback_years = Column("paybackYears", Numeric, nullable=True)
    status = Column(String, default="active")  # 'active', 'completed', 'cancelled'
    photo_url = Column("photoUrl", String, nullable=True)
    created_at = Column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updatedAt", DateTime(timezone=True), onupdate=func.now())

    organization_id = Column("organizationId", String, ForeignKey("organizations.id"))

    # Relationships
    organization = relationship("Organization", back_populates="transactions")
    documents = relationship("TransactionDocument", back_populates="transaction")
    due_diligence_tasks = relationship("DueDiligenceTask", back_populates="transaction")


class TransactionDocument(Base):
    __tablename__ = "transaction_documents"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # 'financial', 'legal', 'operational', 'commercial'
    file_name = Column("fileName", String, nullable=True)
    file_path = Column("filePath", String, nullable=True)
    file_url = Column("fileUrl", String, nullable=True)
    mime_type = Column("mimeType", String, nullable=True)
    size = Column(Integer, nullable=False)  # File size in bytes
    status = Column(String, default="pending")  # 'pending', 'reviewed', 'approved', 'rejected'
    upload_date = Column("uploadDate", DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column("reviewedAt", DateTime(timezone=True), nullable=True)

    transaction_id = Column("transactionId", String, ForeignKey("transactions.id"), nullable=True)
    organization_id = Column("organizationId", String, ForeignKey("organizations.id"))
    reviewer_id = Column("reviewerId", String, ForeignKey("users.id"), nullable=True)

    # Relationships
    transaction = relationship("Transaction", back_populates="documents")
    organization = relationship("Organization", back_populates="transaction_docs")
    reviewer = relationship("User", back_populates="reviewed_docs")


class DueDiligenceTask(Base):
    __tablename__ = "due_diligence_tasks"

    id = Column(String, primary_key=True, index=True)
    task = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="pending")  # 'pending', 'in-progress', 'completed', 'blocked'
    priority = Column(String, default="medium")  # 'low', 'medium', 'high', 'critical'
    due_date = Column("dueDate", DateTime(timezone=True), nullable=True)
    completed_at = Column("completedAt", DateTime(timezone=True), nullable=True)
    created_at = Column("createdAt", DateTime(timezone=True), server_default=func.now())

    transaction_id = Column("transactionId", String, ForeignKey("transactions.id"))
    assignee_id = Column("assigneeId", String, ForeignKey("users.id"), nullable=True)

    # Relationships
    transaction = relationship("Transaction", back_populates="due_diligence_tasks")
    assignee = relationship("User", back_populates="assigned_tasks")