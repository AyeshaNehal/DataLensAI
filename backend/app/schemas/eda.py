from typing import Any
from pydantic import BaseModel, Field


class ColumnSummary(BaseModel):
    """
    Summary statistics for a single column (numeric or categorical).
    """
    name: str
    type: str
    missing_count: int
    missing_percentage: float
    distinct_count: int
    # Numeric stats (None for categorical columns)
    mean: float | None = None
    median: float | None = None
    std: float | None = None
    min: float | None = None
    max: float | None = None
    # Categorical stats (None for numeric columns)
    top_value: str | None = None
    top_count: int | None = None


class DatasetSummaryResponse(BaseModel):
    """
    Complete exploratory data analysis (EDA) summary for an entire dataset.
    """
    dataset_id: int
    dataset_name: str
    row_count: int
    column_count: int
    columns: list[ColumnSummary]


class DistributionBin(BaseModel):
    """
    Single bar/bin for histogram or categorical frequency chart.
    """
    label: str
    count: int
    percentage: float


class ColumnDistributionResponse(BaseModel):
    """
    Distribution data formatted specifically for Recharts BarChart rendering.
    """
    column_name: str
    column_type: str
    total_count: int
    bins: list[DistributionBin]


class CorrelationCell(BaseModel):
    """
    Pairwise Pearson correlation between two numeric columns.
    """
    x: str
    y: str
    value: float


class CorrelationMatrixResponse(BaseModel):
    """
    Correlation matrix for all numeric columns in a dataset.
    """
    columns: list[str]
    matrix: list[CorrelationCell]


class CustomChartResponse(BaseModel):
    """
    X-Y data points formatted for interactive chart builder in Recharts.
    """
    x_col: str
    y_col: str
    chart_type: str
    data: list[dict[str, Any]]
