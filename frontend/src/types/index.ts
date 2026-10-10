export interface User {
  id: string;
  email: string;
  display_name: string;
  role: 'user' | 'reviewer' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata_json?: Record<string, any>;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

export interface ConfidenceAssessment {
  id: string;
  decision_id: string;
  raw_signals_json: Record<string, number>;
  available_signals_json: string[];
  unavailable_signals_json: string[];
  feature_weights_json: Record<string, number>;
  pre_adjustment_score: number;
  final_score: number;
  scoring_version: string;
  explanation_json: {
    pre_adjustment_score: number;
    penalties_applied: number;
    penalty_reasons: string[];
    active_weights: Record<string, number>;
    signal_contributions: Record<string, number>;
    disclaimer: string;
  };
  created_at: string;
}

export interface VerificationRun {
  id: string;
  decision_id: string;
  verification_method: string;
  status: 'passed' | 'failed' | 'partial' | 'inconclusive' | 'not_attempted';
  claims_json?: string[];
  evidence_json?: Array<{ title: string; publisher?: string; result?: string }>;
  unsupported_claims_json?: string[];
  contradictions_json?: string[];
  limitations_json?: string[];
  duration_ms: number;
  created_at: string;
}

export interface Decision {
  id: string;
  conversation_id?: string;
  user_id: string;
  task_category: string;
  estimated_confidence: number;
  confidence_label: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  routing_action: 'answer' | 'verify' | 'clarify' | 'specialist' | 'escalate' | 'decline';
  routing_reason: string;
  policy_version: string;
  scoring_version: string;
  processing_time_ms: number;
  final_status: string;
  created_at: string;
  confidence_assessment?: ConfidenceAssessment;
  verification_runs?: VerificationRun[];
}

export interface AssistantProcessResponse {
  conversation_id: string;
  user_message: Message;
  assistant_message: Message;
  decision: Decision;
  processing_stages: Array<{
    stage: number;
    title: string;
    status: string;
    timestamp: string;
  }>;
}

export interface ReviewRequest {
  id: string;
  decision_id: string;
  assigned_reviewer_id?: string;
  status: 'pending' | 'assigned' | 'approved' | 'rejected' | 'needs_info';
  reason: string;
  reviewer_notes?: string;
  reviewer_decision?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  decision?: Decision;
}

export interface EvaluationDataset {
  id: string;
  name: string;
  description: string;
  version: string;
  case_count: number;
}

export interface EvaluationResult {
  id: string;
  evaluation_run_id: string;
  evaluation_case_id: string;
  pipeline_type: 'baseline' | 'trust_aware';
  generated_answer: string;
  measured_correctness: boolean;
  estimated_confidence: number;
  routing_action: string;
  verification_status: string;
  latency_ms: number;
  failure_category?: string;
}

export interface EvaluationRun {
  id: string;
  dataset_id: string;
  provider_name: string;
  model_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  results?: EvaluationResult[];
}

export interface SpecialistAgent {
  name: string;
  title: string;
  description: string;
  supported_categories: string[];
  capabilities: string[];
  limitations: string[];
  is_active: boolean;
  total_executions: number;
  success_count: number;
  avg_duration_ms: number;
}

export interface DashboardSummary {
  total_requests: number;
  answered_directly: number;
  verified_count: number;
  clarification_count: number;
  escalated_count: number;
  verification_pass_rate: number;
  low_confidence_count: number;
  avg_processing_time_ms: number;
  recent_decisions: Decision[];
  confidence_distribution: Record<string, number>;
  routing_distribution: Record<string, number>;
}
