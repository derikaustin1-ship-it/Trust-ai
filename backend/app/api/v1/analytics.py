from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api.deps import get_db, get_current_user
from app.models import User, Decision, VerificationRun, ReviewRequest

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
def get_analytics_overview(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Decision)
    if current_user.role == "user":
        query = query.filter(Decision.user_id == current_user.id)

    total_decisions = query.count()
    
    # Risk Distribution
    risk_dist = {
        "low": query.filter(Decision.risk_level == "low").count(),
        "medium": query.filter(Decision.risk_level == "medium").count(),
        "high": query.filter(Decision.risk_level == "high").count(),
        "critical": query.filter(Decision.risk_level == "critical").count()
    }

    # Action Distribution
    action_dist = {
        "answer": query.filter(Decision.routing_action == "answer").count(),
        "verify": query.filter(Decision.routing_action == "verify").count(),
        "clarify": query.filter(Decision.routing_action == "clarify").count(),
        "specialist": query.filter(Decision.routing_action == "specialist").count(),
        "escalate": query.filter(Decision.routing_action == "escalate").count(),
        "decline": query.filter(Decision.routing_action == "decline").count()
    }

    # Category Breakdown
    categories = db.query(Decision.task_category, func.count(Decision.id))\
        .filter(Decision.user_id == current_user.id if current_user.role == "user" else True)\
        .group_by(Decision.task_category).all()
    category_dist = {cat: count for cat, count in categories}

    return {
        "total_decisions": total_decisions,
        "risk_distribution": risk_dist,
        "routing_action_distribution": action_dist,
        "category_distribution": category_dist
    }
