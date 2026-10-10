from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models import User, Conversation, Message
from app.schemas import ConversationCreate, ConversationResponse, ConversationUpdate

router = APIRouter(prefix="/conversations", tags=["Conversations"])

@router.get("", response_model=List[ConversationResponse])
def get_conversations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    convs = db.query(Conversation).filter(Conversation.user_id == current_user.id).order_by(Conversation.updated_at.desc()).all()
    return convs

@router.post("", response_model=ConversationResponse)
def create_conversation(conv_in: ConversationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    conv = Conversation(user_id=current_user.id, title=conv_in.title or "New Conversation")
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv

@router.get("/{conversation_id}", response_model=ConversationResponse)
def get_conversation(conversation_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    return conv

@router.patch("/{conversation_id}", response_model=ConversationResponse)
def update_conversation(conversation_id: str, conv_in: ConversationUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    conv.title = conv_in.title
    db.commit()
    db.refresh(conv)
    return conv

@router.delete("/{conversation_id}")
def delete_conversation(conversation_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    db.delete(conv)
    db.commit()
    return {"message": "Conversation deleted successfully"}
