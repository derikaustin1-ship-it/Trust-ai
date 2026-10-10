from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models import User, Decision
from app.schemas import DecisionResponse

router = APIRouter(prefix="/decisions", tags=["Decision History"])

@router.get("", response_model=List[DecisionResponse])
def search_decisions(
    category: Optional[str] = Query(None),
    routing_action: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    min_confidence: Optional[float] = Query(None),
    max_confidence: Optional[float] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Decision)
    if current_user.role == "user":
        query = query.filter(Decision.user_id == current_user.id)

    if category:
        query = query.filter(Decision.task_category == category)
    if routing_action:
        query = query.filter(Decision.routing_action == routing_action)
    if risk_level:
        query = query.filter(Decision.risk_level == risk_level)
    if min_confidence is not None:
        query = query.filter(Decision.estimated_confidence >= min_confidence)
    if max_confidence is not None:
        query = query.filter(Decision.estimated_confidence <= max_confidence)

    return query.order_by(Decision.created_at.desc()).all()

@router.get("/{decision_id}", response_model=DecisionResponse)
def get_decision(decision_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Decision).filter(Decision.id == decision_id)
    if current_user.role == "user":
        query = query.filter(Decision.user_id == current_user.id)
    dec = query.first()
    if not dec:
        raise HTTPException(status_code=404, detail="Decision record not found.")
    return dec
