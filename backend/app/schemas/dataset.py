from datetime import datetime
from typing import Any
from pydantic import BaseModel, ConfigDict, Field


class ColumnSchema(BaseModel):
    """
    Schema for individual CSV column metadata.
    """
    name: str
    type: str  # e.g., 'int64', 'float64', 'object', 'datetime64[ns]', 'bool'
    sample_values: list[Any] = Field(default_factory=list)


class DatasetBase(BaseModel):
    """
    Shared properties for a dataset.
    """
    name: str
    description: str | None = None


class DatasetCreate(DatasetBase):
    """
    Schema for internal creation of dataset metadata after CSV inspection.
    """
    file_path: str
    row_count: int
    column_count: int
    columns: list[ColumnSchema]
    file_size_bytes: int


class DatasetResponse(DatasetBase):
    """
    API Response schema for dataset metadata.
    """
    id: int
    user_id: int
    row_count: int
    column_count: int
    columns: list[ColumnSchema]
    file_size_bytes: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DatasetPreviewResponse(BaseModel):
    """
    Response schema returning dataset metadata combined with the first N rows for table inspection.
    """
    dataset: DatasetResponse
    preview_rows: list[dict[str, Any]]
