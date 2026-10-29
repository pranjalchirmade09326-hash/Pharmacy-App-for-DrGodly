import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DrGodly Pharmacy Assist API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/v1"
    
    # Database
    # Default to PostgreSQL, with safe fallback to SQLite for local development
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite+aiosqlite:///./drgodly_pharmacy.db"
    )
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "drgodly_pharmacy")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    
    @property
    def async_postgres_url(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # JWT Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "drgodly_clinical_secret_key_pharmacy_2026_super_secure")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 Hours

    # Telephony Gateway (Exotel / Twilio)
    TELEPHONY_ACCOUNT_SID: str = os.getenv("TELEPHONY_ACCOUNT_SID", "mock_telephony_sid")
    TELEPHONY_AUTH_TOKEN: str = os.getenv("TELEPHONY_AUTH_TOKEN", "mock_telephony_token")
    TELEPHONY_VIRTUAL_DID: str = os.getenv("TELEPHONY_VIRTUAL_DID", "+918069000000")

    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8081",
        "http://localhost:19006",
        "http://127.0.0.1:8081",
        "*",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
