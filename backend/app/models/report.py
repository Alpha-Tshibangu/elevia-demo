from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    type = Column(String, nullable=False)  # 'board-deck', 'investor-update', 'management-report', 'compliance-report'
    frequency = Column(String, nullable=True)  # 'weekly', 'monthly', 'quarterly', 'annually'
    status = Column(String, default="draft")  # 'draft', 'ready', 'scheduled', 'overdue'
    last_generated = Column("lastGenerated", DateTime(timezone=True), nullable=True)
    next_due = Column("nextDue", DateTime(timezone=True), nullable=True)
    file_path = Column("filePath", String, nullable=True)
    file_url = Column("fileUrl", String, nullable=True)
    icon_url = Column("iconUrl", String, nullable=True)

    organization_id = Column("organizationId", String, ForeignKey("organizations.id"))
    created_at = Column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updatedAt", DateTime(timezone=True), onupdate=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="reports")