from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api.deps import get_db, get_current_user
from app.models import User, AgentExecution
from app.schemas import SpecialistAgentResponse
from app.services.specialist_agents import SpecialistAgentRegistry

router = APIRouter(prefix="/agents", tags=["Specialist Agents"])

@router.get("", response_model=List[SpecialistAgentResponse])
def get_agents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    agents = SpecialistAgentRegistry.list_agents()
    response = []
    
    for a in agents:
        name = a["name"]
        exec_query = db.query(AgentExecution).filter(AgentExecution.agent_name == name)
        total = exec_query.count()
        success = exec_query.filter(AgentExecution.status == "success").count()
        avg_dur = db.query(func.avg(AgentExecution.duration_ms)).filter(AgentExecution.agent_name == name).scalar() or 0.0

        response.append(SpecialistAgentResponse(
            name=a["name"],
            title=a["title"],
            description=a["description"],
            supported_categories=a["supported_categories"],
            capabilities=a["capabilities"],
            limitations=a["limitations"],
            is_active=a["is_active"],
            total_executions=total,
            success_count=success,
            avg_duration_ms=round(avg_dur, 1)
        ))
    return response

@router.get("/{agent_name}", response_model=SpecialistAgentResponse)
def get_agent_detail(agent_name: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    agent = SpecialistAgentRegistry.get_agent(agent_name)
    if not agent:
        raise HTTPException(status_code=404, detail="Specialist agent not found.")
    
    exec_query = db.query(AgentExecution).filter(AgentExecution.agent_name == agent_name)
    total = exec_query.count()
    success = exec_query.filter(AgentExecution.status == "success").count()
    avg_dur = db.query(func.avg(AgentExecution.duration_ms)).filter(AgentExecution.agent_name == agent_name).scalar() or 0.0

    return SpecialistAgentResponse(
        name=agent["name"],
        title=agent["title"],
        description=agent["description"],
        supported_categories=agent["supported_categories"],
        capabilities=agent["capabilities"],
        limitations=agent["limitations"],
        is_active=agent["is_active"],
        total_executions=total,
        success_count=success,
        avg_duration_ms=round(avg_dur, 1)
    )
