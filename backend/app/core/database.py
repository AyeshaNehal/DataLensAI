from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

# Check if we are using SQLite to configure check_same_thread argument
database_url = settings.get_database_url()
connect_args = {}
if database_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    database_url,
    connect_args=connect_args,
    pool_pre_ping=True,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """
    Base class for SQLAlchemy 2.0 declarative models.
    """
    pass


def get_db():
    """
    FastAPI dependency that provides a transactional database session.
    Automatically closes the session after the API request finishes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
