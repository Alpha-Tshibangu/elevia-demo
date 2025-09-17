from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="admin")  # 'admin', 'analyst', 'viewer'
    photo_url = Column("photoUrl", String, nullable=True)
    created_at = Column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updatedAt", DateTime(timezone=True), onupdate=func.now())

    # Relationships
    reviewed_docs = relationship("TransactionDocument", back_populates="reviewer")
    assigned_tasks = relationship("DueDiligenceTask", back_populates="assignee")