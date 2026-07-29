from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables or .env file.
    Pydantic automatically validates required variables and types.
    """
    PROJECT_NAME: str = "DataLensAI API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    # JWT Authentication settings
    SECRET_KEY: str = "supersecret_datalensai_jwt_secret_key_change_in_production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    ALGORITHM: str = "HS256"

    # Database URL
    DATABASE_URL: str = "sqlite:///./datalens.db"

    # Optional AI API Key
    GROQ_API_KEY: str | None = None

    def get_database_url(self) -> str:
        """
        SQLAlchemy 2.0 requires 'postgresql://' scheme, but some cloud providers
        (like Render or Heroku) use 'postgres://'. Automatically convert if needed.
        """
        url = self.DATABASE_URL
        if url and url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql://", 1)
        return url

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
