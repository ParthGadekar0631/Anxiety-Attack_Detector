from app.relapse_model import predict_relapse
from app.risk_model import wearable_risk
from app.schemas import RelapseInput, VoiceStressInput, WearableRiskInput
from app.voice_feature_model import score_voice_stress


def test_voice_stress_scoring():
    result = score_voice_stress(VoiceStressInput(speech_rate=185, pitch_variance=0.8, pause_count=8, volume_variance=0.8))
    assert result["voice_stress_score"] >= 70


def test_wearable_anomaly_detection():
    result = wearable_risk(WearableRiskInput(heart_rate=118, oxygen_level=95, hrv=28, sleep_hours=4.5, respiratory_rate=21))
    assert result["anomaly_detected"] is True
    assert result["wearable_risk_score"] > 50


def test_relapse_prediction():
    result = predict_relapse(
        RelapseInput(
            episodes_last_7_days=4,
            average_risk_score=78,
            average_stress=8,
            poor_sleep_days=3,
            trigger_recurrence_count=3,
            wearable_anomaly_count=2,
            average_voice_stress=70,
        )
    )
    assert result["relapse_risk_score"] >= 70
    assert result["window"] == "24-72 hours"
