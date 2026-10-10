from typing import Dict, Any, Tuple

class RiskAssessmentEngine:
    """
    Evaluates operational risk (Low, Medium, High, Critical) independently from confidence.
    High confidence never overrides critical risk rules.
    """

    CRITICAL_CATEGORIES = {"financial_action", "medical_diagnosis", "legal_liability"}
    HIGH_RISK_KEYWORDS = [
        "execute trade", "transfer money", "delete database", "prescribe",
        "legal contract", "wire transfer", "50,000", "financial decision"
    ]

    @classmethod
    def evaluate(
        cls,
        prompt: str,
        category: str = "general",
        changes_external_state: bool = False,
        is_irreversible: bool = False
    ) -> Dict[str, Any]:
        prompt_lower = prompt.lower()
        risk_level = "low"
        risk_reasons = []

        # 1. Critical risk checks
        if any(kw in prompt_lower for kw in ["execute trade", "stock trade", "transfer money", "50,000", "wire transfer"]):
            risk_level = "critical"
            risk_reasons.append("Request involves executing high-value financial actions or irreversible state changes.")
        elif category in cls.CRITICAL_CATEGORIES:
            risk_level = "critical"
            risk_reasons.append(f"Task category '{category}' is designated as critical risk by enterprise safety policy.")
        elif is_irreversible and changes_external_state:
            risk_level = "critical"
            risk_reasons.append("Irreversible external action execution requested.")

        # 2. High risk checks
        elif risk_level != "critical":
            if category in ["financial", "medical", "legal"]:
                risk_level = "high"
                risk_reasons.append(f"Consequential category '{category}' requires verification or human review.")
            elif changes_external_state:
                risk_level = "high"
                risk_reasons.append("Modifies external state or user data.")
            elif "delete" in prompt_lower or "modify" in prompt_lower:
                risk_level = "high"
                risk_reasons.append("Includes potential destructive operations.")

        # 3. Medium risk checks
        elif risk_level == "low":
            if category in ["programming", "research"]:
                risk_level = "medium"
                risk_reasons.append(f"Domain task in '{category}' can carry moderate technical consequence if incorrect.")
            elif len(prompt) > 500:
                risk_level = "medium"
                risk_reasons.append("Complex multi-part request.")

        if not risk_reasons:
            risk_reasons.append("Standard informational request with low risk of harm.")

        return {
            "risk_level": risk_level,
            "reasons": risk_reasons,
            "category": category,
            "is_consequential": risk_level in ["high", "critical"],
            "requires_human_gate": risk_level == "critical"
        }
