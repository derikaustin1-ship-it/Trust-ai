from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field

# Authentication
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    display_name: str = Field(..., min_length=2)
    role: Optional[str] = "user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class UserResponse(BaseModel):
    id: str
    email: str
    display_name: str
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Conversation & Messaging
class MessageCreate(BaseModel):
    content: str
    scenario_id: Optional[str] = None
    override_category: Optional[str] = None

class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    metadata_json: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    title: Optional[str] = "New Conversation"

class ConversationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    created_at: datetime
    updated_at: datetime
    messages: Optional[List[MessageResponse]] = []

    class Config:
        from_attributes = True

class ConversationUpdate(BaseModel):
    title: str

# Confidence Engine Schemas
class SignalValue(BaseModel):
    name: str
    score: float  # 0 to 100
    weight: float
    description: str
    available: bool

class ConfidenceAssessmentResponse(BaseModel):
    id: str
    decision_id: str
    raw_signals_json: Dict[str, Any]
    available_signals_json: List[str]
    unavailable_signals_json: List[str]
    feature_weights_json: Dict[str, float]
    pre_adjustment_score: float
    final_score: float
    scoring_version: str
    explanation_json: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

# Verification Schemas
class EvidenceSourceResponse(BaseModel):
    id: str
    title: str
    source_url: Optional[str] = None
    publisher: Optional[str] = None
    retrieved_at: datetime
    reliability_metadata_json: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class VerificationRunResponse(BaseModel):
    id: str
    decision_id: str
    verification_method: str
    status: str
    claims_json: Optional[List[Any]] = None
    evidence_json: Optional[List[Any]] = None
    unsupported_claims_json: Optional[List[Any]] = None
    contradictions_json: Optional[List[Any]] = None
    limitations_json: Optional[List[Any]] = None
    duration_ms: float
    created_at: datetime
    evidence_sources: Optional[List[EvidenceSourceResponse]] = []

    class Config:
        from_attributes = True

# Agent Execution Schema
class AgentExecutionResponse(BaseModel):
    id: str
    agent_name: str
    status: str
    duration_ms: float
    error_message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Decision Schema
class DecisionResponse(BaseModel):
    id: str
    conversation_id: Optional[str] = None
    user_id: str
    task_category: str
    estimated_confidence: float
    confidence_label: str
    risk_level: str
    routing_action: str
    routing_reason: str
    policy_version: str
    scoring_version: str
    processing_time_ms: float
    final_status: str
    created_at: datetime
    confidence_assessment: Optional[ConfidenceAssessmentResponse] = None
    verification_runs: Optional[List[VerificationRunResponse]] = []
    agent_executions: Optional[List[AgentExecutionResponse]] = []

    class Config:
        from_attributes = True

# Assistant Response Schema
class AssistantProcessResponse(BaseModel):
    conversation_id: str
    user_message: MessageResponse
    assistant_message: MessageResponse
    decision: DecisionResponse
    processing_stages: List[Dict[str, Any]]

# Review Request & Workflow
class ReviewEventResponse(BaseModel):
    id: str
    review_request_id: str
    actor_user_id: str
    event_type: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ReviewRequestResponse(BaseModel):
    id: str
    decision_id: str
    assigned_reviewer_id: Optional[str] = None
    status: str
    reason: str
    reviewer_notes: Optional[str] = None
    reviewer_decision: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None
    decision: Optional[DecisionResponse] = None
    events: Optional[List[ReviewEventResponse]] = []

    class Config:
        from_attributes = True

class ReviewActionRequest(BaseModel):
    notes: Optional[str] = None

class ReviewAssignRequest(BaseModel):
    reviewer_id: str

# Evaluation Schemas
class EvaluationCaseResponse(BaseModel):
    id: str
    category: str
    prompt: str
    reference_answer: Optional[str] = None
    expected_behavior: str
    expected_risk: str
    should_escalate: bool
    labels_json: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class EvaluationResultResponse(BaseModel):
    id: str
    evaluation_run_id: str
    evaluation_case_id: str
    pipeline_type: str
    generated_answer: str
    measured_correctness: bool
    estimated_confidence: float
    routing_action: str
    verification_status: str
    latency_ms: float
    failure_category: Optional[str] = None
    details_json: Optional[Dict[str, Any]] = None
    evaluation_case: Optional[EvaluationCaseResponse] = None

    class Config:
        from_attributes = True

class EvaluationRunCreate(BaseModel):
    dataset_id: str
    provider_name: Optional[str] = "demo"
    model_name: Optional[str] = "demo-model"

class EvaluationRunResponse(BaseModel):
    id: str
    dataset_id: str
    user_id: Optional[str] = None
    provider_name: str
    model_name: str
    configuration_json: Optional[Dict[str, Any]] = None
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    results: Optional[List[EvaluationResultResponse]] = []

    class Config:
        from_attributes = True

# Feedback Schema
class FeedbackCreate(BaseModel):
    decision_id: str
    rating: int = Field(..., ge=1, le=5)
    feedback_text: Optional[str] = None

# Analytics & Dashboard Schemas
class DashboardSummaryResponse(BaseModel):
    total_requests: int
    answered_directly: int
    verified_count: int
    clarification_count: int
    escalated_count: int
    verification_pass_rate: float
    low_confidence_count: int
    avg_processing_time_ms: float
    recent_decisions: List[DecisionResponse]
    confidence_distribution: Dict[str, int]
    routing_distribution: Dict[str, int]

class SpecialistAgentResponse(BaseModel):
    name: str
    title: str
    description: str
    supported_categories: List[str]
    capabilities: List[str]
    limitations: List[str]
    is_active: bool
    total_executions: int
    success_count: int
    avg_duration_ms: float
