from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.eda import (
    DatasetSummaryResponse,
    ColumnDistributionResponse,
    CorrelationMatrixResponse,
    CustomChartResponse,
)
from app.services import eda_service

router = APIRouter()


@router.get("/{dataset_id}/summary", response_model=DatasetSummaryResponse)
def get_dataset_eda_summary(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get full EDA summary statistics for every column in the dataset (numeric & categorical).
    """
    return eda_service.get_dataset_summary(
        db=db, dataset_id=dataset_id, user_id=current_user.id
    )


@router.get("/{dataset_id}/distribution", response_model=ColumnDistributionResponse)
def get_column_distribution(
    dataset_id: int,
    column: str = Query(..., description="Name of column to compute distribution/histogram for"),
    bins: int = Query(10, ge=2, le=30, description="Number of histogram bins"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get binned histogram or top categorical frequency distribution formatted for Recharts BarChart.
    """
    return eda_service.get_column_distribution(
        db=db,
        dataset_id=dataset_id,
        user_id=current_user.id,
        column_name=column,
        bins_count=bins,
    )


@router.get("/{dataset_id}/correlation", response_model=CorrelationMatrixResponse)
def get_correlation_matrix(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get pairwise Pearson correlation matrix for all numeric columns.
    """
    return eda_service.get_correlation_matrix(
        db=db, dataset_id=dataset_id, user_id=current_user.id
    )


@router.get("/{dataset_id}/chart-data", response_model=CustomChartResponse)
def get_chart_data(
    dataset_id: int,
    x_col: str = Query(..., description="Column for X Axis"),
    y_col: str = Query(..., description="Column for Y Axis"),
    chart_type: str = Query("bar", description="Chart type: 'bar' | 'line' | 'area'"),
    limit: int = Query(50, ge=5, le=200, description="Max rows to return for chart"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get custom X-Y aggregated data points for the interactive Chart Studio.
    """
    return eda_service.get_custom_chart_data(
        db=db,
        dataset_id=dataset_id,
        user_id=current_user.id,
        x_col=x_col,
        y_col=y_col,
        chart_type=chart_type,
        limit=limit,
    )
