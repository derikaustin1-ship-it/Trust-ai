import csv
import io
import time
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models import EvaluationDataset, EvaluationCase, EvaluationRun, EvaluationResult
from app.services.llm_provider import get_llm_provider
from app.services.confidence_engine import ConfidenceEngine
from app.services.risk_assessment import RiskAssessmentEngine
from app.services.verification_engine import VerificationEngine
from app.services.routing_engine import RoutingEngine

class EvaluationService:
    """
    Evaluation Laboratory benchmark executor comparing Baseline AI vs TRUSTIQ AI.
    """

    @classmethod
    def run_benchmark(cls, db: Session, dataset_id: str, user_id: Optional[str] = None) -> EvaluationRun:
        dataset = db.query(EvaluationDataset).filter(EvaluationDataset.id == dataset_id).first()
        if not dataset or not dataset.cases:
            raise ValueError("Dataset not found or contains no test cases.")

        run = EvaluationRun(
            dataset_id=dataset_id,
            user_id=user_id,
            provider_name="demo",
            model_name="demo-model",
            status="running",
            started_at=datetime.now(timezone.utc)
        )
        db.add(run)
        db.commit()
        db.refresh(run)

        llm = get_llm_provider()

        for case in dataset.cases:
            # 1. Execute Baseline AI (Direct answer without trust pipeline)
            t0 = time.time()
            baseline_resp = llm.generate(prompt=case.prompt, category=case.category)
            baseline_latency = (time.time() - t0) * 1000.0
            
            # Baseline evaluation metrics
            baseline_correct = False if case.should_escalate or case.expected_behavior in ["clarify", "decline"] else True
            
            res_baseline = EvaluationResult(
                evaluation_run_id=run.id,
                evaluation_case_id=case.id,
                pipeline_type="baseline",
                generated_answer=baseline_resp["content"],
                measured_correctness=baseline_correct,
                estimated_confidence=90.0, # Baseline AI is overconfident
                routing_action="answer",
                verification_status="not_attempted",
                latency_ms=round(baseline_latency, 2),
                failure_category="unnecessary_automation" if case.should_escalate else None
            )
            db.add(res_baseline)

            # 2. Execute TRUSTIQ AI Pipeline
            t1 = time.time()
            trust_resp = llm.generate(prompt=case.prompt, category=case.category)
            
            risk_res = RiskAssessmentEngine.evaluate(prompt=case.prompt, category=case.category)
            verif_res = VerificationEngine.verify(
                prompt=case.prompt,
                response_text=trust_resp["content"],
                claims=trust_resp.get("claims", []),
                method=trust_resp.get("suggested_verification", "auto")
            )
            conf_res = ConfidenceEngine.calculate_score(
                evidence_quality=0.90 if verif_res["status"] == "passed" else 0.30,
                evidence_coverage=0.85 if len(trust_resp.get("claims", [])) > 0 else 0.40,
                verification_status=verif_res["status"],
                provider_confidence=trust_resp.get("provider_confidence", 0.70),
                detected_ambiguity=trust_resp.get("detected_ambiguity", False),
                missing_context_count=len(trust_resp.get("missing_context", [])),
                has_contradictions=len(verif_res["contradictions"]) > 0
            )
            route_res = RoutingEngine.select_route(
                confidence_score=conf_res["final_score"],
                risk_level=risk_res["risk_level"],
                detected_ambiguity=trust_resp.get("detected_ambiguity", False),
                missing_context_count=len(trust_resp.get("missing_context", [])),
                verification_status=verif_res["status"],
                task_category=case.category,
                has_contradictions=len(verif_res["contradictions"]) > 0
            )
            trust_latency = (time.time() - t1) * 1000.0

            # Measured correctness logic for TRUSTIQ AI
            trust_correct = (route_res["action"] == case.expected_behavior)

            res_trust = EvaluationResult(
                evaluation_run_id=run.id,
                evaluation_case_id=case.id,
                pipeline_type="trust_aware",
                generated_answer=trust_resp["content"],
                measured_correctness=trust_correct,
                estimated_confidence=conf_res["final_score"],
                routing_action=route_res["action"],
                verification_status=verif_res["status"],
                latency_ms=round(trust_latency, 2),
                failure_category=None if trust_correct else "policy_mismatch"
            )
            db.add(res_trust)

        run.status = "completed"
        run.completed_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(run)

        return run

    @classmethod
    def export_csv(cls, db: Session, run_id: str) -> str:
        results = db.query(EvaluationResult).filter(EvaluationResult.evaluation_run_id == run_id).all()
        output = io.StringIO()
        writer = csv.writer(output)
        
        writer.writerow([
            "Result ID", "Case Category", "Prompt", "Pipeline Type",
            "Expected Action", "Routing Action", "Estimated Confidence",
            "Verification Status", "Measured Correctness", "Latency (ms)"
        ])

        for r in results:
            writer.writerow([
                r.id,
                r.evaluation_case.category if r.evaluation_case else "N/A",
                r.evaluation_case.prompt[:50] if r.evaluation_case else "N/A",
                r.pipeline_type,
                r.evaluation_case.expected_behavior if r.evaluation_case else "N/A",
                r.routing_action,
                r.estimated_confidence,
                r.verification_status,
                r.measured_correctness,
                r.latency_ms
            ])

        return output.getvalue()
