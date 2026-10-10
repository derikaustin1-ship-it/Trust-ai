from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api.deps import get_db, get_current_user
from app.models import User, Decision, VerificationRun
from app.schemas import DashboardSummaryResponse, DecisionResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Query database metrics owned by user (or global for reviewer/admin)
    query = db.query(Decision)
    if current_user.role == "user":
        query = query.filter(Decision.user_id == current_user.id)
    
    total_requests = query.count()
    answered_directly = query.filter(Decision.routing_action == "answer").count()
    verified_count = query.filter(Decision.routing_action == "verify").count()
    clarification_count = query.filter(Decision.routing_action == "clarify").count()
    escalated_count = query.filter(Decision.routing_action == "escalate").count()
    low_confidence_count = query.filter(Decision.estimated_confidence < 50.0).count()

    # Verification pass rate
    verif_runs = db.query(VerificationRun).join(Decision).filter(Decision.user_id == current_user.id if current_user.role == "user" else True)
    total_verif = verif_runs.filter(VerificationRun.status != "not_attempted").count()
    passed_verif = verif_runs.filter(VerificationRun.status == "passed").count()
    verif_pass_rate = round((passed_verif / total_verif * 100.0), 1) if total_verif > 0 else 100.0

    # Avg processing time
    avg_time = db.query(func.avg(Decision.processing_time_ms)).filter(Decision.user_id == current_user.id if current_user.role == "user" else True).scalar() or 0.0

    recent = query.order_by(Decision.created_at.desc()).limit(10).all()

    # Confidence distribution
    conf_dist = {
        "High (80-100)": query.filter(Decision.estimated_confidence >= 80.0).count(),
        "Moderate (50-79)": query.filter(Decision.estimated_confidence >= 50.0, Decision.estimated_confidence < 80.0).count(),
        "Low (0-49)": query.filter(Decision.estimated_confidence < 50.0).count()
    }

    # Routing distribution
    routing_dist = {
        "Answer": answered_directly,
        "Verify": verified_count,
        "Clarify": clarification_count,
        "Specialist": query.filter(Decision.routing_action == "specialist").count(),
        "Escalate": escalated_count,
        "Decline": query.filter(Decision.routing_action == "decline").count()
    }

    return DashboardSummaryResponse(
        total_requests=total_requests,
        answered_directly=answered_directly,
        verified_count=verified_count,
        clarification_count=clarification_count,
        escalated_count=escalated_count,
        verification_pass_rate=verif_pass_rate,
        low_confidence_count=low_confidence_count,
        avg_processing_time_ms=round(avg_time, 1),
        recent_decisions=[DecisionResponse.model_validate(d) for d in recent],
        confidence_distribution=conf_dist,
        routing_distribution=routing_dist
    )
