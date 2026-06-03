from app.predict import predict
from app.schemas import PredictionInput


def test_high_risk_prediction():
    result = predict(
        PredictionInput(
            stress_level=9,
            heart_rate=122,
            sleep_quality=3,
            breathing_irregularity=True,
            trigger_event=True,
            chest_tightness=8,
            dizziness=6,
            recent_episode_count=3,
            voice_stress_score=80,
        )
    )
    assert result.risk_score >= 80
    assert result.risk_category == "High"
    assert "High stress level" in result.explanation
