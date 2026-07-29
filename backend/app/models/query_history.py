from datetime import datetime, timezone
from typing import Any
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class QueryHistory(Base):
    """
    SQLAlchemy model representing a natural language question asked by a user
    against a specific dataset, along with the AI-generated answer, Python/Pandas code,
    and optional Recharts configuration.
    """
    __tablename__ = "query_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    dataset_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("datasets.id", ondelete="CASCADE"), index=True, nullable=False
    )
    question: Mapped[str] = mapped_column(String(500), nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=False)
    generated_code: Mapped[str | None] = mapped_column(Text, nullable=True)
    chart_config: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    user = relationship("User", backref="queries")
    dataset = relationship("Dataset", backref="queries")
