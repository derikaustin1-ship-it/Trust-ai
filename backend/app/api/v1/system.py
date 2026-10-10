from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.api.deps import get_db
from app.core.config import settings

router = APIRouter(tags=["System"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "scoring_version": settings.CONFIDENCE_SCORING_VERSION,
        "llm_provider": settings.LLM_PROVIDER
    }

@router.get("/ready")
def readiness_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    return {
        "status": "ready" if db_status == "connected" else "not_ready",
        "database": db_status
    }
