import os
import uuid
import pandas as pd
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from app.models.dataset import Dataset
from app.schemas.dataset import ColumnSchema, DatasetCreate

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


async def save_and_profile_csv(
    db: Session,
    user_id: int,
    file: UploadFile,
    description: str | None = None
) -> Dataset:
    """
    1. Validates file extension (.csv).
    2. Saves file to local uploads directory (or cloud storage).
    3. Profiles dataset schema using Pandas (dtypes, row/col counts, sample values).
    4. Persists metadata to PostgreSQL/SQLite database.
    """
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only .csv files are supported."
        )

    # Generate a unique secure filename to avoid collisions
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{user_id}_{uuid.uuid4().hex}{file_ext}"
    user_upload_dir = os.path.join(UPLOAD_DIR, str(user_id))
    os.makedirs(user_upload_dir, exist_ok=True)
    file_path = os.path.join(user_upload_dir, unique_filename)

    # Read bytes and save to disk
    contents = await file.read()
    file_size_bytes = len(contents)
    if file_size_bytes == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded CSV file is empty."
        )

    with open(file_path, "wb") as f:
        f.write(contents)

    # Profile using pandas
    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        # Clean up corrupted file
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not parse CSV file: {str(e)}"
        )

    row_count = int(len(df))
    column_count = int(len(df.columns))

    columns_schema = []
    for col in df.columns:
        col_type = str(df[col].dtype)
        # Extract up to 3 non-null sample values for schema preview
        sample_vals = df[col].dropna().head(3).tolist()
        # Ensure sample values are JSON serializable (convert np numbers to python types)
        sample_vals_clean = [
            val.item() if hasattr(val, "item") else val for val in sample_vals
        ]
        columns_schema.append(
            ColumnSchema(
                name=str(col),
                type=col_type,
                sample_values=sample_vals_clean
            ).model_dump()
        )

    # Save metadata to DB
    db_dataset = Dataset(
        user_id=user_id,
        name=file.filename,
        description=description,
        file_path=file_path,
        row_count=row_count,
        column_count=column_count,
        columns=columns_schema,
        file_size_bytes=file_size_bytes
    )
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    return db_dataset


def get_user_datasets(db: Session, user_id: int) -> list[Dataset]:
    """
    Retrieve all datasets uploaded by a specific user, ordered by newest first.
    """
    return (
        db.query(Dataset)
        .filter(Dataset.user_id == user_id)
        .order_by(Dataset.created_at.desc())
        .all()
    )


def get_dataset_by_id(db: Session, dataset_id: int, user_id: int) -> Dataset | None:
    """
    Retrieve a dataset by ID, ensuring it belongs to the requesting user.
    """
    return (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id, Dataset.user_id == user_id)
        .first()
    )


def get_dataset_preview_rows(file_path: str, limit: int = 50) -> list[dict]:
    """
    Load the first N rows of a CSV file as clean JSON-serializable dictionaries.
    Replaces NaNs with None so JSON encoding succeeds.
    """
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Raw dataset file not found on disk."
        )
    df = pd.read_csv(file_path, nrows=limit)
    # Replace NaN values with None for JSON serialization
    df_clean = df.where(pd.notnull(df), None)
    return df_clean.to_dict(orient="records")


def delete_dataset(db: Session, dataset_id: int, user_id: int) -> bool:
    """
    Delete a dataset record and remove its raw CSV file from storage.
    """
    dataset = get_dataset_by_id(db, dataset_id=dataset_id, user_id=user_id)
    if not dataset:
        return False

    # Remove file from disk if it exists
    if os.path.exists(dataset.file_path):
        try:
            os.remove(dataset.file_path)
        except OSError:
            pass

    db.delete(dataset)
    db.commit()
    return True
