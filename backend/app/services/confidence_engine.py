from typing import Dict, Any, List, Tuple
from app.core.config import settings

class ConfidenceEngine:
    """
    Independent confidence estimation engine that computes a normalized score (0-100)
    combining multiple empirical signals: evidence quality, coverage, verification status,
    model self-assessment, historical reliability, and ambiguity penalties.
    """
    VERSION = "1.0.0"

    # Base feature weights (must sum to 1.0)
    DEFAULT_WEIGHTS = {
        "evidence_quality": 0.25,
        "evidence_coverage": 0.20,
        "verification_outcome": 0.25,
        "model_confidence": 0.10,
        "historical_task_performance": 0.10,
        "consistency_agreement": 0.10,
    }

    @classmethod
    def calculate_score(
        cls,
        evidence_quality: float = 0.0,       # 0.0 to 1.0
        evidence_coverage: float = 0.0,      # 0.0 to 1.0
        verification_status: str = "not_attempted",  # passed, failed, partial, inconclusive, not_attempted
        provider_confidence: float = 0.5,    # 0.0 to 1.0
        historical_accuracy: float = 0.85,   # 0.0 to 1.0
        detected_ambiguity: bool = False,
        missing_context_count: int = 0,
        has_contradictions: bool = False,
        signals_availability: Dict[str, bool] = None
    ) -> Dict[str, Any]:
        """
        Computes normalized confidence assessment score and full explanation metadata.
        """
        if signals_availability is None:
            signals_availability = {
                "evidence_quality": True if evidence_quality > 0 else False,
                "evidence_coverage": True if evidence_coverage > 0 else False,
                "verification_outcome": verification_status != "not_attempted",
                "model_confidence": True,
                "historical_task_performance": True,
                "consistency_agreement": False  # Multi-sample sampling disabled by default in baseline
            }

        # 1. Map raw signal scores (0 to 100)
        signal_scores: Dict[str, float] = {}

        # Evidence quality & coverage
        signal_scores["evidence_quality"] = evidence_quality * 100.0
        signal_scores["evidence_coverage"] = evidence_coverage * 100.0

        # Verification outcome mapping
        if verification_status == "passed":
            signal_scores["verification_outcome"] = 100.0
        elif verification_status == "partial":
            signal_scores["verification_outcome"] = 60.0
        elif verification_status == "inconclusive":
            signal_scores["verification_outcome"] = 40.0
        elif verification_status == "failed":
            signal_scores["verification_outcome"] = 0.0
        else: # not_attempted
            signal_scores["verification_outcome"] = 50.0  # Neutral baseline if not attempted

        signal_scores["model_confidence"] = provider_confidence * 100.0
        signal_scores["historical_task_performance"] = historical_accuracy * 100.0
        signal_scores["consistency_agreement"] = 75.0  # Default neutral score

        # 2. Filter available signals and re-normalize weights
        available_signals = [s for s, avail in signals_availability.items() if avail]
        unavailable_signals = [s for s, avail in signals_availability.items() if not avail]

        active_weights = {s: cls.DEFAULT_WEIGHTS[s] for s in available_signals}
        total_active_weight = sum(active_weights.values())

        if total_active_weight > 0:
            normalized_weights = {s: w / total_active_weight for s, w in active_weights.items()}
        else:
            normalized_weights = {s: 1.0 / len(cls.DEFAULT_WEIGHTS) for s in cls.DEFAULT_WEIGHTS}

        # 3. Calculate pre-adjustment weighted score
        pre_adjustment_score = sum(signal_scores[s] * normalized_weights.get(s, 0.0) for s in available_signals)

        # 4. Apply explicit penalties for negative indicators
        penalties = 0.0
        penalty_reasons = []

        if verification_status == "failed":
            penalties += 35.0
            penalty_reasons.append("Failed verification check (-35 pts)")

        if has_contradictions:
            penalties += 30.0
            penalty_reasons.append("Detected internal contradiction in claims (-30 pts)")

        if detected_ambiguity:
            penalties += 20.0
            penalty_reasons.append("Detected prompt ambiguity (-20 pts)")

        if missing_context_count > 0:
            missing_penalty = min(30.0, missing_context_count * 10.0)
            penalties += missing_penalty
            penalty_reasons.append(f"Missing {missing_context_count} critical context items (-{missing_penalty:.0f} pts)")

        # Final score strictly clamped between 0 and 100
        final_score = max(0.0, min(100.0, pre_adjustment_score - penalties))

        # Assign confidence label
        if final_score >= 80.0:
            label = "High estimated confidence"
        elif final_score >= 50.0:
            label = "Moderate estimated confidence"
        else:
            label = "Low estimated confidence"

        explanation = {
            "pre_adjustment_score": round(pre_adjustment_score, 2),
            "penalties_applied": round(penalties, 2),
            "penalty_reasons": penalty_reasons,
            "active_weights": {k: round(v, 3) for k, v in normalized_weights.items()},
            "signal_contributions": {s: round(signal_scores[s] * normalized_weights[s], 2) for s in available_signals},
            "disclaimer": "This score estimates output reliability based on empirical signals. It is a decision heuristic, not a guaranteed statistical probability."
        }

        return {
            "final_score": round(final_score, 2),
            "pre_adjustment_score": round(pre_adjustment_score, 2),
            "confidence_label": label,
            "raw_signals": signal_scores,
            "available_signals": available_signals,
            "unavailable_signals": unavailable_signals,
            "feature_weights": normalized_weights,
            "explanation": explanation,
            "scoring_version": cls.VERSION
        }
