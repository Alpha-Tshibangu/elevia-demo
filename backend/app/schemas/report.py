from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class ReportResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    type: str
    frequency: Optional[str]
    status: str
    last_generated: Optional[datetime] = Field(alias="lastGenerated")
    next_due: Optional[datetime] = Field(alias="nextDue")
    file_url: Optional[str] = Field(alias="fileUrl")
    icon_url: Optional[str] = Field(alias="iconUrl")

    class Config:
        from_attributes = True
        allow_population_by_field_name = True


class ReportSummary(BaseModel):
    total: int
    ready: int
    scheduled: int
    overdue: int


class ReportsResponse(BaseModel):
    reports: List[ReportResponse]
    summary: ReportSummary