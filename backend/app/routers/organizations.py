from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.models.organization import Organization
from app.schemas.organization import OrganizationResponse

router = APIRouter()


@router.get("/", response_model=Optional[OrganizationResponse])
async def get_organization(db: Session = Depends(get_db)):
    """Get the first organization (simplified single-org model)"""
    organization = db.query(Organization).first()
    if not organization:
        return None
    return organization


@router.get("/current", response_model=Optional[OrganizationResponse])
async def get_current_organization(db: Session = Depends(get_db)):
    """Get current organization - alias for main endpoint"""
    return await get_organization(db)