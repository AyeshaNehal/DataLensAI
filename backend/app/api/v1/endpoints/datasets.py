from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.dataset import (
    DatasetResponse,
    DatasetPreviewResponse,
)
from app.services import csv_service

router = APIRouter()


@router.post("/upload", response_model=DatasetResponse, status_code=status.HTTP_201_CREATED)
async def upload_dataset(
    file: UploadFile = File(...),
    description: str | None = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload a new CSV file.
    Profiles column schema & statistics using Pandas and stores metadata in PostgreSQL/SQLite.
    """
    dataset = await csv_service.save_and_profile_csv(
        db=db,
        user_id=current_user.id,
        file=file,
        description=description
    )
    return dataset


@router.get("/", response_model=list[DatasetResponse])
def list_my_datasets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all CSV datasets uploaded by the currently authenticated user.
    """
    return csv_service.get_user_datasets(db=db, user_id=current_user.id)


@router.get("/{dataset_id}/preview", response_model=DatasetPreviewResponse)
def get_dataset_preview(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get dataset metadata along with the first 50 rows for table inspection.
    """
    dataset = csv_service.get_dataset_by_id(
        db=db, dataset_id=dataset_id, user_id=current_user.id
    )
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found or access denied."
        )

    rows = csv_service.get_dataset_preview_rows(dataset.file_path, limit=50)
    return DatasetPreviewResponse(dataset=dataset, preview_rows=rows)


@router.delete("/{dataset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a dataset and its raw CSV file from disk.
    """
    success = csv_service.delete_dataset(
        db=db, dataset_id=dataset_id, user_id=current_user.id
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found or access denied."
        )
    return None
