from typing import List
from pydantic import field_validator
from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "Elevia Financial Intelligence API"
    DEBUG: bool = False
    VERSION: str = "1.0.0"

    # Database settings
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/elevia_db"

    # Security settings
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS settings - Allow all origins for now
    ALLOWED_ORIGINS: List[str] = ["*"]
    ALLOWED_HOSTS: List[str] = ["*"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
