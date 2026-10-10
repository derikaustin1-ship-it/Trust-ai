from datetime import datetime, timezone
import uuid
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON, Index, Enum as SQLEnum
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="user", index=True) # user, reviewer, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    decisions = relationship("Decision", back_populates="user")
    reviews_assigned = relationship("ReviewRequest", foreign_keys="ReviewRequest.assigned_reviewer_id", back_populates="assigned_reviewer")
    feedbacks = relationship("Feedback", back_populates="user")
    audit_events = relationship("AuditEvent", back_populates="user")


class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False, default="New Conversation")
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.created_at")
    decisions = relationship("Decision", back_populates="conversation")


class Message(Base):
    __tablename__ = "messages"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    conversation_id = Column(String(36), ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String(50), nullable=False) # user, assistant, system
    content = Column(Text, nullable=False)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    conversation = relationship("Conversation", back_populates="messages")


class Decision(Base):
    __tablename__ = "decisions"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    conversation_id = Column(String(36), ForeignKey("conversations.id", ondelete="SET NULL"), nullable=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    request_message_id = Column(String(36), nullable=True)
    response_message_id = Column(String(36), nullable=True)
    
    task_category = Column(String(100), nullable=False, default="general", index=True)
    estimated_confidence = Column(Float, nullable=False, index=True) # 0.0 to 100.0
    confidence_label = Column(String(50), nullable=False) # High, Moderate, Low
    risk_level = Column(String(50), nullable=False, index=True) # low, medium, high, critical
    routing_action = Column(String(50), nullable=False, index=True) # answer, verify, clarify, specialist, escalate, decline
    routing_reason = Column(Text, nullable=False)
    policy_version = Column(String(50), nullable=False, default="1.0.0")
    scoring_version = Column(String(50), nullable=False, default="1.0.0")
    processing_time_ms = Column(Float, nullable=False, default=0.0)
    final_status = Column(String(50), nullable=False, default="completed") # completed, pending_review, clarified, failed
    created_at = Column(DateTime(timezone=True), default=utc_now, index=True)
    
    user = relationship("User", back_populates="decisions")
    conversation = relationship("Conversation", back_populates="decisions")
    confidence_assessment = relationship("ConfidenceAssessment", back_populates="decision", uselist=False, cascade="all, delete-orphan")
    verification_runs = relationship("VerificationRun", back_populates="decision", cascade="all, delete-orphan")
    agent_executions = relationship("AgentExecution", back_populates="decision", cascade="all, delete-orphan")
    review_request = relationship("ReviewRequest", back_populates="decision", uselist=False, cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="decision")


class ConfidenceAssessment(Base):
    __tablename__ = "confidence_assessments"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    decision_id = Column(String(36), ForeignKey("decisions.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    
    raw_signals_json = Column(JSON, nullable=False)
    available_signals_json = Column(JSON, nullable=False)
    unavailable_signals_json = Column(JSON, nullable=False)
    feature_weights_json = Column(JSON, nullable=False)
    pre_adjustment_score = Column(Float, nullable=False)
    final_score = Column(Float, nullable=False)
    scoring_version = Column(String(50), nullable=False, default="1.0.0")
    explanation_json = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    decision = relationship("Decision", back_populates="confidence_assessment")


class VerificationRun(Base):
    __tablename__ = "verification_runs"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    decision_id = Column(String(36), ForeignKey("decisions.id", ondelete="CASCADE"), nullable=False, index=True)
    
    verification_method = Column(String(100), nullable=False) # math, schema, claims, contradiction, consistency, external_search
    status = Column(String(50), nullable=False) # passed, failed, partial, inconclusive, not_attempted
    claims_json = Column(JSON, nullable=True)
    evidence_json = Column(JSON, nullable=True)
    unsupported_claims_json = Column(JSON, nullable=True)
    contradictions_json = Column(JSON, nullable=True)
    limitations_json = Column(JSON, nullable=True)
    duration_ms = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    decision = relationship("Decision", back_populates="verification_runs")
    evidence_sources = relationship("EvidenceSource", back_populates="verification_run", cascade="all, delete-orphan")


class EvidenceSource(Base):
    __tablename__ = "evidence_sources"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    verification_run_id = Column(String(36), ForeignKey("verification_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    source_url = Column(String(500), nullable=True)
    publisher = Column(String(255), nullable=True)
    retrieved_at = Column(DateTime(timezone=True), default=utc_now)
    reliability_metadata_json = Column(JSON, nullable=True)
    
    verification_run = relationship("VerificationRun", back_populates="evidence_sources")


class AgentExecution(Base):
    __tablename__ = "agent_executions"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    decision_id = Column(String(36), ForeignKey("decisions.id", ondelete="CASCADE"), nullable=False, index=True)
    
    agent_name = Column(String(100), nullable=False) # research, code_review, math_verification, general_knowledge, risk_review
    input_json = Column(JSON, nullable=True)
    output_json = Column(JSON, nullable=True)
    status = Column(String(50), nullable=False, default="success") # success, failed
    duration_ms = Column(Float, default=0.0)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    decision = relationship("Decision", back_populates="agent_executions")


class ReviewRequest(Base):
    __tablename__ = "review_requests"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    decision_id = Column(String(36), ForeignKey("decisions.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    assigned_reviewer_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    
    status = Column(String(50), nullable=False, default="pending", index=True) # pending, assigned, approved, rejected, needs_info
    reason = Column(Text, nullable=False)
    reviewer_notes = Column(Text, nullable=True)
    reviewer_decision = Column(String(50), nullable=True) # approve, reject, request_info
    created_at = Column(DateTime(timezone=True), default=utc_now, index=True)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    
    decision = relationship("Decision", back_populates="review_request")
    assigned_reviewer = relationship("User", foreign_keys=[assigned_reviewer_id], back_populates="reviews_assigned")
    events = relationship("ReviewEvent", back_populates="review_request", cascade="all, delete-orphan", order_by="ReviewEvent.created_at")


class ReviewEvent(Base):
    __tablename__ = "review_events"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    review_request_id = Column(String(36), ForeignKey("review_requests.id", ondelete="CASCADE"), nullable=False, index=True)
    actor_user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    event_type = Column(String(50), nullable=False) # created, assigned, approved, rejected, info_requested, comment_added
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    review_request = relationship("ReviewRequest", back_populates="events")


class EvaluationDataset(Base):
    __tablename__ = "evaluation_datasets"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    version = Column(String(50), nullable=False, default="1.0.0")
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    cases = relationship("EvaluationCase", back_populates="dataset", cascade="all, delete-orphan")
    runs = relationship("EvaluationRun", back_populates="dataset")


class EvaluationCase(Base):
    __tablename__ = "evaluation_cases"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    dataset_id = Column(String(36), ForeignKey("evaluation_datasets.id", ondelete="CASCADE"), nullable=False, index=True)
    
    category = Column(String(100), nullable=False, index=True)
    prompt = Column(Text, nullable=False)
    reference_answer = Column(Text, nullable=True)
    expected_behavior = Column(String(100), nullable=False) # answer, verify, clarify, escalate, decline
    expected_risk = Column(String(50), nullable=False, default="low")
    should_escalate = Column(Boolean, default=False)
    labels_json = Column(JSON, nullable=True)
    
    dataset = relationship("EvaluationDataset", back_populates="cases")
    results = relationship("EvaluationResult", back_populates="evaluation_case", cascade="all, delete-orphan")


class EvaluationRun(Base):
    __tablename__ = "evaluation_runs"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    dataset_id = Column(String(36), ForeignKey("evaluation_datasets.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    provider_name = Column(String(100), nullable=False, default="demo")
    model_name = Column(String(100), nullable=False, default="demo-model")
    configuration_json = Column(JSON, nullable=True)
    status = Column(String(50), nullable=False, default="pending") # pending, running, completed, failed
    started_at = Column(DateTime(timezone=True), default=utc_now)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    dataset = relationship("EvaluationDataset", back_populates="runs")
    results = relationship("EvaluationResult", back_populates="evaluation_run", cascade="all, delete-orphan")


class EvaluationResult(Base):
    __tablename__ = "evaluation_results"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    evaluation_run_id = Column(String(36), ForeignKey("evaluation_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    evaluation_case_id = Column(String(36), ForeignKey("evaluation_cases.id", ondelete="CASCADE"), nullable=False, index=True)
    
    pipeline_type = Column(String(50), nullable=False) # baseline vs trust_aware
    generated_answer = Column(Text, nullable=False)
    measured_correctness = Column(Boolean, nullable=False, default=True)
    estimated_confidence = Column(Float, nullable=False)
    routing_action = Column(String(50), nullable=False)
    verification_status = Column(String(50), nullable=False)
    latency_ms = Column(Float, nullable=False, default=0.0)
    failure_category = Column(String(100), nullable=True)
    details_json = Column(JSON, nullable=True)
    
    evaluation_run = relationship("EvaluationRun", back_populates="results")
    evaluation_case = relationship("EvaluationCase", back_populates="results")


class Feedback(Base):
    __tablename__ = "feedbacks"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    decision_id = Column(String(36), ForeignKey("decisions.id", ondelete="CASCADE"), nullable=False)
    
    rating = Column(Integer, nullable=False) # 1 to 5
    feedback_text = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    user = relationship("User", back_populates="feedbacks")
    decision = relationship("Decision", back_populates="feedbacks")


class AuditEvent(Base):
    __tablename__ = "audit_events"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    
    event_type = Column(String(100), nullable=False, index=True)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(36), nullable=True)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, index=True)
    
    user = relationship("User", back_populates="audit_events")
