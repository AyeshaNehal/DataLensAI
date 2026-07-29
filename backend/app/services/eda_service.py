import os
import math
import numpy as np
import pandas as pd
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.services.csv_service import get_dataset_by_id
from app.schemas.eda import (
    ColumnSummary,
    DatasetSummaryResponse,
    DistributionBin,
    ColumnDistributionResponse,
    CorrelationCell,
    CorrelationMatrixResponse,
    CustomChartResponse,
)


def _safe_float(val) -> float | None:
    """Helper to convert float to None if NaN or inf for clean JSON serialization."""
    if val is None:
        return None
    try:
        f = float(val)
        if math.isnan(f) or math.isinf(f):
            return None
        return round(f, 4)
    except (ValueError, TypeError):
        return None


def get_dataset_summary(db: Session, dataset_id: int, user_id: int) -> DatasetSummaryResponse:
    """
    Compute comprehensive exploratory data analysis (EDA) statistics for all columns.
    """
    dataset = get_dataset_by_id(db, dataset_id=dataset_id, user_id=user_id)
    if not dataset or not os.path.exists(dataset.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found or access denied."
        )

    df = pd.read_csv(dataset.file_path)
    total_rows = len(df)

    columns_summary = []
    for col in df.columns:
        series = df[col]
        missing_count = int(series.isna().sum())
        missing_percentage = round((missing_count / total_rows) * 100, 2) if total_rows > 0 else 0.0
        distinct_count = int(series.nunique(dropna=True))

        col_type = str(series.dtype)
        summary = ColumnSummary(
            name=str(col),
            type=col_type,
            missing_count=missing_count,
            missing_percentage=missing_percentage,
            distinct_count=distinct_count,
        )

        # Check if column is numeric
        if pd.api.types.is_numeric_dtype(series) and not pd.api.types.is_bool_dtype(series):
            valid_series = series.dropna()
            if not valid_series.empty:
                summary.mean = _safe_float(valid_series.mean())
                summary.median = _safe_float(valid_series.median())
                summary.std = _safe_float(valid_series.std())
                summary.min = _safe_float(valid_series.min())
                summary.max = _safe_float(valid_series.max())
        else:
            # Categorical / text / boolean summary
            mode_series = series.mode(dropna=True)
            if not mode_series.empty:
                top_val = str(mode_series.iloc[0])
                top_count = int((series == mode_series.iloc[0]).sum())
                summary.top_value = top_val
                summary.top_count = top_count

        columns_summary.append(summary)

    return DatasetSummaryResponse(
        dataset_id=dataset.id,
        dataset_name=dataset.name,
        row_count=total_rows,
        column_count=len(df.columns),
        columns=columns_summary,
    )


def get_column_distribution(
    db: Session,
    dataset_id: int,
    user_id: int,
    column_name: str,
    bins_count: int = 10
) -> ColumnDistributionResponse:
    """
    Generate binned distribution data for Recharts BarChart rendering.
    - Numeric: Computes equal-width histogram bins.
    - Categorical: Returns top N most frequent categories by count.
    """
    dataset = get_dataset_by_id(db, dataset_id=dataset_id, user_id=user_id)
    if not dataset or not os.path.exists(dataset.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found or access denied."
        )

    df = pd.read_csv(dataset.file_path)
    if column_name not in df.columns:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Column '{column_name}' not found in dataset."
        )

    series = df[column_name].dropna()
    total_valid = len(series)
    col_type = str(df[column_name].dtype)
    bins: list[DistributionBin] = []

    if total_valid == 0:
        return ColumnDistributionResponse(
            column_name=column_name,
            column_type=col_type,
            total_count=0,
            bins=[]
        )

    if pd.api.types.is_numeric_dtype(series) and not pd.api.types.is_bool_dtype(series):
        # Numeric Histogram
        counts, edges = np.histogram(series, bins=min(bins_count, max(1, len(series.unique()))))
        for i in range(len(counts)):
            c = int(counts[i])
            pct = round((c / total_valid) * 100, 2) if total_valid > 0 else 0.0
            label = f"{edges[i]:.1f}-{edges[i+1]:.1f}"
            bins.append(DistributionBin(label=label, count=c, percentage=pct))
    else:
        # Categorical Value Counts (top 10)
        value_counts = series.value_counts().head(10)
        for val, count in value_counts.items():
            c = int(count)
            pct = round((c / total_valid) * 100, 2) if total_valid > 0 else 0.0
            bins.append(DistributionBin(label=str(val), count=c, percentage=pct))

    return ColumnDistributionResponse(
        column_name=column_name,
        column_type=col_type,
        total_count=total_valid,
        bins=bins,
    )


def get_correlation_matrix(db: Session, dataset_id: int, user_id: int) -> CorrelationMatrixResponse:
    """
    Compute pairwise Pearson correlation matrix for numeric columns.
    """
    dataset = get_dataset_by_id(db, dataset_id=dataset_id, user_id=user_id)
    if not dataset or not os.path.exists(dataset.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found or access denied."
        )

    df = pd.read_csv(dataset.file_path)
    numeric_df = df.select_dtypes(include=["number"])

    # Drop columns with zero variance or all NaN
    numeric_cols = [c for c in numeric_df.columns if numeric_df[c].nunique(dropna=True) > 1]
    if len(numeric_cols) < 2:
        return CorrelationMatrixResponse(columns=numeric_cols, matrix=[])

    corr_df = numeric_df[numeric_cols].corr(method="pearson").fillna(0.0)

    matrix_cells = []
    for col1 in numeric_cols:
        for col2 in numeric_cols:
            val = _safe_float(corr_df.loc[col1, col2]) or 0.0
            matrix_cells.append(
                CorrelationCell(x=str(col1), y=str(col2), value=val)
            )

    return CorrelationMatrixResponse(columns=numeric_cols, matrix=matrix_cells)


def get_custom_chart_data(
    db: Session,
    dataset_id: int,
    user_id: int,
    x_col: str,
    y_col: str,
    chart_type: str,
    limit: int = 50
) -> CustomChartResponse:
    """
    Fetch and aggregate X-Y dataset columns for interactive Recharts plotting.
    """
    dataset = get_dataset_by_id(db, dataset_id=dataset_id, user_id=user_id)
    if not dataset or not os.path.exists(dataset.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found or access denied."
        )

    df = pd.read_csv(dataset.file_path)
    if x_col not in df.columns or y_col not in df.columns:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Specified X or Y column does not exist in dataset."
        )

    sub_df = df[[x_col, y_col]].dropna().head(limit)

    # Convert to list of JSON dictionaries
    data_points = []
    for _, row in sub_df.iterrows():
        x_val = row[x_col].item() if hasattr(row[x_col], "item") else row[x_col]
        y_val = row[y_col].item() if hasattr(row[y_col], "item") else row[y_col]
        # Make sure y_val is numeric if possible
        try:
            y_num = float(y_val)
            y_num = round(y_num, 3)
        except (ValueError, TypeError):
            y_num = 0.0

        data_points.append({
            "name": str(x_val),
            x_col: str(x_val),
            y_col: y_num,
        })

    return CustomChartResponse(
        x_col=x_col,
        y_col=y_col,
        chart_type=chart_type,
        data=data_points
    )
