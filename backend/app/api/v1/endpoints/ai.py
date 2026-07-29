from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.ai_query import (
    ExecutiveInsightsResponse,
    AIQueryRequest,
    AIQueryResponse,
    QueryHistoryItem,
)
from app.services import ai_service

router = APIRouter()


@router.get("/{dataset_id}/insights", response_model=ExecutiveInsightsResponse)
def get_dataset_insights(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Generate an Executive AI Data Analyst report with trends, anomalies, and chart recommendations.
    """
    return ai_service.generate_executive_insights(
        db=db, dataset_id=dataset_id, user_id=current_user.id
    )


@router.post("/query", response_model=AIQueryResponse)
def ask_natural_language_query(
    request: AIQueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Ask a natural language question against a dataset and receive an AI answer,
    Python/Pandas code snippet, and Recharts configuration.
    """
    return ai_service.answer_natural_language_query(
        db=db,
        dataset_id=request.dataset_id,
        user_id=current_user.id,
        question=request.question,
    )


@router.get("/history", response_model=list[QueryHistoryItem])
def get_ai_query_history(
    dataset_id: Optional[int] = Query(None, description="Optional dataset filter"),
    limit: int = Query(30, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve past AI natural language queries asked by the authenticated user.
    """
    return ai_service.get_user_query_history(
        db=db, user_id=current_user.id, dataset_id=dataset_id, limit=limit
    )
