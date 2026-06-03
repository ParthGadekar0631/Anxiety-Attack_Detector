from app.preprocessing import normalized_ml_probability, rule_score
from app.schemas import PredictionInput, PredictionOutput
from app.utils import recommended_intervention, risk_category

MODEL_VERSION = "deterministic-rf-style-v1"


def predict(payload: PredictionInput) -> PredictionOutput:
    rules, explanation = rule_score(payload)
    ml_score = normalized_ml_probability(payload) * 100
    combined = round(min(100, ml_score * 0.7 + rules * 0.3))
    category = risk_category(combined)
    confidence = min(0.96, max(0.55, 0.6 + len(explanation) * 0.045))
    escalation = min(0.98, max(0.08, combined / 100 - 0.08 + len(explanation) * 0.02))
    return PredictionOutput(
        risk_score=combined,
        confidence_score=round(confidence, 2),
        escalation_probability=round(escalation, 2),
        risk_category=category,
        explanation=explanation,
        recommended_intervention=recommended_intervention(category),
        model_version=MODEL_VERSION,
    )
