from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from typing import Optional

from app.core.database import get_db
from app.models.organization import Organization
from app.models.data_source import DataSource
from app.schemas.data_source import DataSourcesResponse, DataSourceResponse, DataSourceSummary

router = APIRouter()


@router.get("/", response_model=Optional[DataSourcesResponse])
async def get_data_sources(db: Session = Depends(get_db)):
    """Get data sources with sync status and summary"""

    # Get the organization
    org = db.query(Organization).first()
    if not org:
        return None

    # Get data sources with sync logs
    sources = db.query(DataSource)\
        .filter(DataSource.organization_id == org.id)\
        .options(joinedload(DataSource.sync_logs))\
        .order_by(DataSource.name)\
        .all()

    # Convert to response format
    converted_sources = []
    for source in sources:
        # Get latest sync log
        latest_sync = sorted(source.sync_logs, key=lambda x: x.sync_started, reverse=True)[:1]

        converted_sources.append(DataSourceResponse(
            id=source.id,
            name=source.name,
            sourceType=source.source_type,
            status=source.status,
            lastSync=source.last_sync,
            nextSync=source.next_sync,
            recordsProcessed=source.records_processed,
            dataQuality=float(source.data_quality),
            errorMessage=source.error_message,
            iconUrl=source.icon_url,
            sync_logs=[{
                'id': log.id,
                'syncStarted': log.sync_started,
                'syncCompleted': log.sync_completed,
                'status': log.status,
                'recordsProcessed': log.records_processed,
                'errorMessage': log.error_message
            } for log in latest_sync]
        ))

    # Calculate summary
    total_records = sum(s.records_processed for s in sources)
    avg_quality = sum(float(s.data_quality) for s in sources) / len(sources) if sources else 0
    active_count = len([s for s in sources if s.status == 'active'])
    error_count = len([s for s in sources if s.status == 'error'])

    summary = DataSourceSummary(
        total_sources=len(sources),
        active_sources=active_count,
        error_sources=error_count,
        total_records=total_records,
        average_quality=avg_quality
    )

    return DataSourcesResponse(
        sources=converted_sources,
        summary=summary
    )