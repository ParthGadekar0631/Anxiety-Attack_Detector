from app.schemas import WearableRiskInput
from app.utils import risk_category


def wearable_risk(payload: WearableRiskInput) -> dict:
    reasons: list[str] = []
    if payload.heart_rate >= 110 and payload.activity_level != "active":
        reasons.append("High resting heart rate")
    if payload.oxygen_level < 94:
        reasons.append("Oxygen level below configured threshold")
    if payload.hrv < 35:
        reasons.append("Low HRV")
    if payload.sleep_hours < 5.5:
        reasons.append("Low sleep duration")
    if payload.respiratory_rate < 10 or payload.respiratory_rate > 20:
        reasons.append("Respiratory rate outside normal range")

    score = min(100, len(reasons) * 22 + max(0, payload.heart_rate - 95))
    return {
        "anomaly_detected": bool(reasons),
        "anomaly_reason": reasons,
        "wearable_risk_score": round(score),
        "risk_category": risk_category(score),
    }
