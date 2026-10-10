from typing import Dict, Any, List

class RoutingEngine:
    """
    Configurable policy engine selecting the optimal response action:
    ANSWER, VERIFY, CLARIFY, SPECIALIST, ESCALATE, or DECLINE.
    """
    POLICY_VERSION = "1.0.0"

    @classmethod
    def select_route(
        cls,
        confidence_score: float,
        risk_level: str,
        detected_ambiguity: bool = False,
        missing_context_count: int = 0,
        verification_status: str = "not_attempted",
        task_category: str = "general",
        has_contradictions: bool = False
    ) -> Dict[str, Any]:
        """
        Determines the routing decision according to confidence, risk, evidence, and task policy.
        """
        action = "answer"
        reason = ""

        # 1. Critical Risk Policy -> Escalate or Decline
        if risk_level == "critical":
            if task_category == "financial_action" or "trade" in task_category:
                action = "decline"
                reason = "Automated execution of critical financial transactions is declined by enterprise risk safety policy."
            else:
                action = "escalate"
                reason = "Critical risk request requiring human authorization and oversight."

        # 2. Ambiguity & Missing Context Policy -> Clarify
        elif detected_ambiguity or missing_context_count > 0:
            action = "clarify"
            reason = f"Request contains ambiguity or missing {missing_context_count} required context elements for a reliable response."

        # 3. Failed Verification or Contradictions -> Escalate
        elif verification_status == "failed" or has_contradictions:
            action = "escalate"
            reason = "Verification check failed or contradictory evidence detected; escalated to human review queue."

        # 4. Specialist Agent Routing Policy
        elif task_category in ["programming", "code"] and confidence_score >= 70.0:
            action = "specialist"
            reason = "Routed to Specialist Code Review Agent for domain execution."
        elif task_category == "research" and confidence_score >= 70.0:
            action = "specialist"
            reason = "Routed to Specialist Research Agent for domain synthesis."

        # 5. Verification Required Policy -> Verify
        elif verification_status in ["not_attempted", "partial"] and confidence_score < 80.0 and risk_level in ["medium", "high"]:
            action = "verify"
            reason = "Moderate confidence on consequential request requires empirical evidence verification before answering."

        # 6. Low Confidence Policy -> Escalate
        elif confidence_score < 50.0:
            action = "escalate"
            reason = f"Estimated confidence ({confidence_score:.1f}/100) falls below autonomous answer threshold."

        # 7. Safe Direct Answer -> Answer
        else:
            action = "answer"
            reason = f"High estimated confidence ({confidence_score:.1f}/100) and acceptable risk profile permit direct response."

        return {
            "action": action,
            "reason": reason,
            "policy_version": cls.POLICY_VERSION,
            "confidence_score": confidence_score,
            "risk_level": risk_level,
            "verification_status": verification_status
        }
