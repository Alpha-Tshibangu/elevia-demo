from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.models.organization import Organization
from app.models.report import Report
from app.schemas.report import ReportsResponse, ReportResponse, ReportSummary

router = APIRouter()


@router.get("/", response_model=Optional[ReportsResponse])
async def get_reports(db: Session = Depends(get_db)):
    """Get all reports with summary"""

    # Get the organization
    org = db.query(Organization).first()
    if not org:
        return None

    # Get reports
    reports = db.query(Report)\
        .filter(Report.organization_id == org.id)\
        .order_by(Report.last_generated.desc())\
        .all()

    # Convert to response format
    converted_reports = []
    for report in reports:
        converted_reports.append(ReportResponse(
            id=report.id,
            title=report.title,
            description=report.description,
            type=report.type,
            frequency=report.frequency,
            status=report.status,
            lastGenerated=report.last_generated,
            nextDue=report.next_due,
            fileUrl=report.file_url,
            iconUrl=report.icon_url
        ))

    # Calculate summary
    ready_reports = [r for r in reports if r.status == 'ready']
    scheduled_reports = [r for r in reports if r.status == 'scheduled']
    overdue_reports = [r for r in reports if r.status == 'overdue']

    summary = ReportSummary(
        total=len(reports),
        ready=len(ready_reports),
        scheduled=len(scheduled_reports),
        overdue=len(overdue_reports)
    )

    return ReportsResponse(
        reports=converted_reports,
        summary=summary
    )