from pydantic import BaseModel, Field


class PredictionInput(BaseModel):
    stress_level: int = Field(ge=1, le=10)
    heart_rate: int = Field(ge=40, le=220)
    sleep_quality: int = Field(ge=1, le=10)
    breathing_irregularity: bool = False
    trigger_event: bool = False
    caffeine_intake: int = Field(default=0, ge=0, le=12)
    chest_tightness: int = Field(default=0, ge=0, le=10)
    dizziness: int = Field(default=0, ge=0, le=10)
    recent_sleep_hours: float = Field(default=7.0, ge=0, le=16)
    recent_episode_count: int = Field(default=0, ge=0, le=100)
    wearable_heart_rate: int | None = None
    wearable_oxygen_level: float | None = None
    voice_stress_score: int = Field(default=0, ge=0, le=100)


class PredictionOutput(BaseModel):
    risk_score: int
    confidence_score: float
    escalation_probability: float
    risk_category: str
    explanation: list[str]
    recommended_intervention: str
    model_version: str


class VoiceStressInput(BaseModel):
    speech_rate: float = 155
    pitch_variance: float = 0.45
    pause_count: int = 4
    volume_variance: float = 0.4


class WearableRiskInput(BaseModel):
    source: str = "simulated"
    heart_rate: int = 90
    oxygen_level: float = 97
    hrv: float = 45
    sleep_hours: float = 7
    respiratory_rate: float = 16
    activity_level: str = "resting"


class RelapseInput(BaseModel):
    episodes_last_7_days: int = Field(default=0, ge=0)
    average_risk_score: float = Field(default=0, ge=0, le=100)
    average_stress: float = Field(default=0, ge=0, le=10)
    poor_sleep_days: int = Field(default=0, ge=0)
    trigger_recurrence_count: int = Field(default=0, ge=0)
    wearable_anomaly_count: int = Field(default=0, ge=0)
    average_voice_stress: float = Field(default=0, ge=0, le=100)
