from app.schemas import RelapseInput
from app.utils import risk_category


def predict_relapse(payload: RelapseInput) -> dict:
    score = min(
        100,
        round(
            payload.episodes_last_7_days * 9
            + payload.average_risk_score * 0.32
            + payload.average_stress * 3
            + payload.poor_sleep_days * 8
            + payload.trigger_recurrence_count * 4
            + payload.wearable_anomaly_count * 10
            + payload.average_voice_stress * 0.12
        ),
    )
    return {
        "relapse_risk_score": score,
        "relapse_risk_category": risk_category(score),
        "window": "24-72 hours",
        "explanation": [
            f"{payload.episodes_last_7_days} episode(s) in the last 7 days",
            f"Average risk score: {round(payload.average_risk_score)}",
            f"{payload.poor_sleep_days} poor-sleep day(s)",
            f"{payload.wearable_anomaly_count} wearable anomaly/anomalies",
        ],
    }
