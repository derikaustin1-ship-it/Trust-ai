import os
from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "TRUSTIQ AI"
    APP_ENV: str = "development"
    API_PREFIX: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite:///./trustiq.db"
    
    # Security
    JWT_SECRET_KEY: str = "trustiq-super-secret-key-change-in-production-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours for dev convenience
    
    # CORS
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ]
    
    # LLM & Tools Configuration
    LLM_PROVIDER: str = "demo"  # 'demo', 'openai', 'anthropic', 'custom'
    LLM_API_KEY: Optional[str] = None
    LLM_MODEL: Optional[str] = "demo-model"
    SEARCH_PROVIDER: str = "disabled"  # 'disabled', 'tavily', 'serp'
    SEARCH_API_KEY: Optional[str] = None
    
    # Confidence Engine
    CONFIDENCE_SCORING_VERSION: str = "1.0.0"
    ENABLE_DEMO_DATA: bool = True
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
