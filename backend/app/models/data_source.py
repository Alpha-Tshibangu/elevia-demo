from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    source_type = Column("sourceType", String, nullable=False)  # 'Excel', 'CSV', 'API', 'Database', 'PDF'
    status = Column(String, default="inactive")  # 'active', 'syncing', 'error', 'inactive'
    connection_string = Column("connectionString", String, nullable=True)
    last_sync = Column("lastSync", DateTime(timezone=True), nullable=True)
    next_sync = Column("nextSync", DateTime(timezone=True), nullable=True)
    records_processed = Column("recordsProcessed", Integer, default=0)
    data_quality = Column("dataQuality", Numeric, default=0)  # 0-100 quality score
    error_message = Column("errorMessage", String, nullable=True)
    icon_url = Column("iconUrl", String, nullable=True)

    organization_id = Column("organizationId", String, ForeignKey("organizations.id"))
    created_at = Column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updatedAt", DateTime(timezone=True), onupdate=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="data_sources")
    sync_logs = relationship("DataSyncLog", back_populates="data_source")


class DataSyncLog(Base):
    __tablename__ = "data_sync_logs"

    id = Column(String, primary_key=True, index=True)
    sync_started = Column("syncStarted", DateTime(timezone=True), server_default=func.now())
    sync_completed = Column("syncCompleted", DateTime(timezone=True), nullable=True)
    status = Column(String, nullable=False)  # 'running', 'completed', 'failed'
    records_processed = Column("recordsProcessed", Integer, default=0)
    error_message = Column("errorMessage", String, nullable=True)

    data_source_id = Column("dataSourceId", String, ForeignKey("data_sources.id"))

    # Relationships
    data_source = relationship("DataSource", back_populates="sync_logs")