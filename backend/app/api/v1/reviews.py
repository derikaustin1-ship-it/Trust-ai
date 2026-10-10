from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, get_current_reviewer
from app.models import User, ReviewRequest, ReviewEvent, Decision
from app.schemas import ReviewRequestResponse, ReviewActionRequest, ReviewAssignRequest

router = APIRouter(prefix="/reviews", tags=["Human Review Queue"])

@router.get("", response_model=List[ReviewRequestResponse])
def get_review_queue(
    status_filter: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_reviewer)
):
    query = db.query(ReviewRequest)
    if status_filter:
        query = query.filter(ReviewRequest.status == status_filter)
    return query.order_by(ReviewRequest.created_at.desc()).all()

@router.get("/{review_id}", response_model=ReviewRequestResponse)
def get_review_case(review_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_reviewer)):
    req = db.query(ReviewRequest).filter(ReviewRequest.id == review_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Review case not found.")
    return req

@router.post("/{review_id}/approve", response_model=ReviewRequestResponse)
def approve_case(review_id: str, action: ReviewActionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_reviewer)):
    req = db.query(ReviewRequest).filter(ReviewRequest.id == review_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Review case not found.")
    
    req.status = "approved"
    req.reviewer_decision = "approved"
    req.reviewer_notes = action.notes
    req.resolved_at = datetime.now(timezone.utc)
    if req.decision:
        req.decision.final_status = "approved"

    event = ReviewEvent(
        review_request_id=req.id,
        actor_user_id=current_user.id,
        event_type="approved",
        notes=action.notes or "Reviewer approved decision."
    )
    db.add(event)
    db.commit()
    db.refresh(req)
    return req

@router.post("/{review_id}/reject", response_model=ReviewRequestResponse)
def reject_case(review_id: str, action: ReviewActionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_reviewer)):
    req = db.query(ReviewRequest).filter(ReviewRequest.id == review_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Review case not found.")
    
    req.status = "rejected"
    req.reviewer_decision = "rejected"
    req.reviewer_notes = action.notes
    req.resolved_at = datetime.now(timezone.utc)
    if req.decision:
        req.decision.final_status = "rejected"

    event = ReviewEvent(
        review_request_id=req.id,
        actor_user_id=current_user.id,
        event_type="rejected",
        notes=action.notes or "Reviewer rejected decision."
    )
    db.add(event)
    db.commit()
    db.refresh(req)
    return req

@router.post("/{review_id}/assign", response_model=ReviewRequestResponse)
def assign_case(review_id: str, assign_in: ReviewAssignRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_reviewer)):
    req = db.query(ReviewRequest).filter(ReviewRequest.id == review_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Review case not found.")
    
    req.assigned_reviewer_id = assign_in.reviewer_id
    req.status = "assigned"

    event = ReviewEvent(
        review_request_id=req.id,
        actor_user_id=current_user.id,
        event_type="assigned",
        notes=f"Assigned case to reviewer {assign_in.reviewer_id}"
    )
    db.add(event)
    db.commit()
    db.refresh(req)
    return req
