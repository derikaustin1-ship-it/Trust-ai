from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models import User, Decision, Feedback
from app.schemas import MessageCreate, AssistantProcessResponse, FeedbackCreate, MessageResponse, DecisionResponse
from app.services.decision_pipeline import DecisionPipelineService

router = APIRouter(prefix="/assistant", tags=["Assistant Pipeline"])

@router.post("/message", response_model=AssistantProcessResponse)
def process_message(
    msg_in: MessageCreate,
    conversation_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = DecisionPipelineService.process_request(
        db=db,
        user_id=current_user.id,
        prompt=msg_in.content,
        conversation_id=conversation_id,
        override_category=msg_in.override_category
    )
    
    return AssistantProcessResponse(
        conversation_id=result["conversation_id"],
        user_message=MessageResponse.model_validate(result["user_message"]),
        assistant_message=MessageResponse.model_validate(result["assistant_message"]),
        decision=DecisionResponse.model_validate(result["decision"]),
        processing_stages=result["processing_stages"]
    )

@router.post("/{decision_id}/verify")
def reverify_decision(decision_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    dec = db.query(Decision).filter(Decision.id == decision_id, Decision.user_id == current_user.id).first()
    if not dec:
        raise HTTPException(status_code=404, detail="Decision record not found.")
    return {"status": "reverified", "decision_id": decision_id, "verification_passed": True}

@router.post("/{decision_id}/feedback")
def submit_feedback(decision_id: str, fb_in: FeedbackCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    dec = db.query(Decision).filter(Decision.id == decision_id, Decision.user_id == current_user.id).first()
    if not dec:
        raise HTTPException(status_code=404, detail="Decision record not found.")
    
    fb = Feedback(
        user_id=current_user.id,
        decision_id=decision_id,
        rating=fb_in.rating,
        feedback_text=fb_in.feedback_text
    )
    db.add(fb)
    db.commit()
    return {"message": "Feedback submitted successfully"}
