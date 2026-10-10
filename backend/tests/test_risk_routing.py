import pytest
from app.services.risk_assessment import RiskAssessmentEngine
from app.services.routing_engine import RoutingEngine

def test_financial_trade_is_critical_risk():
    res = RiskAssessmentEngine.evaluate(prompt="Execute $50,000 stock trade for me", category="financial_action")
    assert res["risk_level"] == "critical"
    assert res["requires_human_gate"] is True

def test_critical_risk_is_declined_or_escalated():
    route = RoutingEngine.select_route(
        confidence_score=99.0, # High confidence score
        risk_level="critical",
        task_category="financial_action"
    )
    # High confidence must never override critical risk rule
    assert route["action"] in ["decline", "escalate"]

def test_ambiguity_routes_to_clarify():
    route = RoutingEngine.select_route(
        confidence_score=75.0,
        risk_level="medium",
        detected_ambiguity=True,
        missing_context_count=3
    )
    assert route["action"] == "clarify"
