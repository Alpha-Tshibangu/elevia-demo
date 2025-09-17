from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.routers.financial_metrics import get_model_scenarios as get_scenarios
from app.schemas.financial import ModelScenarioResponse

router = APIRouter()


@router.get("/", response_model=List[ModelScenarioResponse])
async def get_model_scenarios(db: Session = Depends(get_db)):
    """Get model scenarios - delegates to financial metrics router"""
    return await get_scenarios(db)