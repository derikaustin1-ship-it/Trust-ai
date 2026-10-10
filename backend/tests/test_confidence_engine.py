import pytest
from app.services.confidence_engine import ConfidenceEngine

def test_confidence_score_boundaries():
    score_res = ConfidenceEngine.calculate_score(
        evidence_quality=1.0,
        evidence_coverage=1.0,
        verification_status="passed",
        provider_confidence=1.0,
        historical_accuracy=1.0
    )
    assert score_res["final_score"] == 100.0
    assert score_res["confidence_label"] == "High estimated confidence"

def test_failed_verification_applies_penalty():
    passed_res = ConfidenceEngine.calculate_score(
        evidence_quality=0.8,
        verification_status="passed"
    )
    failed_res = ConfidenceEngine.calculate_score(
        evidence_quality=0.8,
        verification_status="failed"
    )
    assert failed_res["final_score"] < passed_res["final_score"]
    assert "Failed verification check (-35 pts)" in failed_res["explanation"]["penalty_reasons"]

def test_ambiguity_and_missing_context_penalty():
    res = ConfidenceEngine.calculate_score(
        evidence_quality=0.9,
        detected_ambiguity=True,
        missing_context_count=2
    )
    assert res["final_score"] < 80.0
    assert len(res["explanation"]["penalty_reasons"]) >= 2
